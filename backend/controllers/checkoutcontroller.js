const stripe = require("stripe")(process.env.STRIPE_KEY);
const Poster = require("../models/posters");
const UserEditsImage = require("../models/usereditsimage");
const Cart = require("../models/cart");

exports.checkoutcontroller = async (req, res) => {
  try {
    console.log("check");
    const posters = await Cart.find();
    console.log("posters:", posters);

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
            currency: "usd",
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
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};
