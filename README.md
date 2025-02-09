# Artivio

Artivio is a customizable poster marketplace where users can explore stunning design posters and make them uniquely theirs without needing design skills. Unlike generic print stores, Artivio offers an interactive design canvas that lets users subtly personalize posters by modifying colours, editing text, rearranging layers, and much more.

## Tech Stack & Key Integrations

- **MERN Stack**: React, Node.js, Express, MongoDB for scalability and high performance.
- **Fabric.js**: Powering the interactive canvas with seamless layer control and real-time customization.
- **DaisyUI + Tailwind CSS**: Ensuring a modern, responsive, and aesthetically pleasing UI.
- **Google Authentication**: Secure and easy login for a seamless user experience.
- **Cloudinary**: Optimized image handling with secure, signed uploads.
- **Nodemailer**: Automated email notifications after successful purchases.
- **Stripe**: Integrated payment gateways for secure transactions.
- **MongoDB with Data Compression**: Efficient storage of user-specific customizations.

Whether you're an art lover looking for exclusive designs or a designer looking to showcase and monetize your work, Artivio bridges the gap between creativity and accessibility—turning art into a personal experience. 🚀

---

## Features

- Users can edit posters, and the edited canvas state is stored in the backend.
- Each user's edits are saved separately, allowing them to retrieve previous work.
- Users can interact with layers, move them around, add shapes and text, manipulate the object's width, height, and color, and upload their images on the canvas.
- Layer management: Each layer can be moved up and down on the Z-axis and can be deleted as well as hidden.
- Canvas data is compressed, divided into chunks, and stored in Cloudinary to efficiently handle large JSON data.
- For secure image and JSON file uploads, Cloudinary signed uploads are used.
- Users and designers can sign up and log in on the platform.
- New designers require admin approval before they can upload their designs. The admin can verify designers via email in their Gmail's inbox.
- Designers receive an email notification once they are approved.
- Designers can upload posters and assets directly to Cloudinary via their dashboard.
- Integrated Stripe Checkout for payments.
- After a successful payment, an order confirmation email is sent via Nodemailer.
- A shopping cart allows users to manage multiple poster orders. Users can add both customized and original posters to their cart.

## Images

![Artivio Landing Page](https://res.cloudinary.com/drhmsjhpq/image/upload/v1739040017/Screenshot_2025-02-08_234653_ibhm1m.png)
![Artivio Landing Page](https://res.cloudinary.com/drhmsjhpq/image/upload/v1739040017/Screenshot_2025-02-08_234707_seok4j.png)
![Poster Editor Page](https://res.cloudinary.com/drhmsjhpq/image/upload/v1739040018/Screenshot_2025-02-08_235314_k4z3d0.png)
![Cart Page](https://res.cloudinary.com/drhmsjhpq/image/upload/v1739040016/Screenshot_2025-02-08_235951_o5qs7p.png)
![Payment Page](https://res.cloudinary.com/drhmsjhpq/image/upload/v1739040015/Screenshot_2025-02-09_000016_uwucus.png)
![Order Confirmation Email](https://res.cloudinary.com/drhmsjhpq/image/upload/v1739040015/Screenshot_2025-02-09_000442_wuia4x.png)
![Designers Dashboard](https://res.cloudinary.com/drhmsjhpq/image/upload/v1739040018/Screenshot_2025-02-09_000318_fo95zh.png)
