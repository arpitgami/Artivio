const stripe = require("stripe")(process.env.STRIPE_KEY);
const Poster = require("../models/posters");
const UserEditsImage = require("../models/usereditsimage");
const Cart = require("../models/cart");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

exports.checkoutcontroller = async (req, res) => {
  try {
    // console.log("check");
    const userid = req.body.userid;
    // console.log("userid : ", userid);
    const posters = await Cart.find({ userid: userid });
    // console.log("posters:", posters);

    const lineItems = await Promise.all(
      posters.map(async (poster) => {
        const posterDetails = await Poster.findById(poster.posterid);

        if (!posterDetails) {
          return res.status(404).json({ error: "Poster not found" });
        }

        let imageURL = posterDetails.imageURL;

        if (poster.customized) {
          const customizedPoster = await UserEditsImage.findOne({
            posterid: poster.posterid,
            userid: poster.userid,
          });

          if (customizedPoster) {
            imageURL = customizedPoster.imageURL;
          }
        }

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: posterDetails.posterName,
              images: [imageURL],
            },
            unit_amount: Math.round(posterDetails.price * 100),
          },
          quantity: poster.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems.filter((item) => item !== null),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/failed`,
      metadata: {
        orderItems: JSON.stringify(lineItems),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};

exports.sendOrderConfirmationEmail = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name;
    const subtotal = session.amount_subtotal / 100;
    const total = session.amount_total / 100;

    const orderItems = JSON.parse(session.metadata.orderItems);
    console.log("orderItems: ", orderItems);

    const itemsHtml = orderItems
      .map(
        (item) => `
        <div style="display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #ddd;">
          <img src="${item.price_data.product_data.images[0]}" alt="${
          item.price_data.product_data.name
        }" style="width: 80px; border-radius: 10px; object-fit: cover;">
          <div style="flex: 1;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">${
              item.price_data.product_data.name
            }</h3>
            <p style="margin: 5px 0; font-size: 14px; color: #666; ">Quantity: ${
              item.quantity
            }</p>
          </div>
          <p style="font-size: 16px; font-weight: bold; color: #333; margin-left: auto; ">₹${(
            item.price_data.unit_amount / 100
          ).toFixed(2)}</p>
        </div>
      `
      )
      .join("");

    const emailHtml = `
      <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #f8f8f8; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Thank You for Your Order, ${customerName}!</h2>
        <p style="text-align: center; color: #555;">Here are your order details:</p>

        <div style="background: #fff; padding: 20px; border-radius: 10px;">
          <h3 style="margin-bottom: 10px;">Items Ordered</h3>
          ${itemsHtml}

          <div style="padding: 15px 0; border-top: 1px solid #ddd;">
            <h3 style="display: flex; justify-content: space-between; border-top: 2px solid #000; padding-top: 10px;"><span>Total (${
              orderItems.length
            } items)</span> <span style="margin-left: auto;">₹${total.toFixed(
      2
    )}</span></h3>
          </div>
        </div>

        <p style="text-align: center; margin-top: 20px; color: #888;">If you have any questions, contact us anytime.</p>
      </div>
    `;

    const mailOptions = {
      from: `"Your Store" <${process.env.GMAIL_USERNAME}>`,
      to: customerEmail,
      subject: "Your Order Confirmation",
      html: emailHtml,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error(" Error sending email:", error);
    }
  }

  res.json({ received: true });
};
