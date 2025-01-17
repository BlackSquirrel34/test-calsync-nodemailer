"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SubmitBtn from "./submit-btn";
import { sendMail } from '@/lib/sendmail';
import toast from 'react-hot-toast';

export default function Contact() {
  // useful for clearing after submit
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  
   // Asynchronous function to handle form submission
   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);

    const senderEmail = formData.get("senderEmail");
    const message = formData.get("message");

    // Check if the values are not null and are of type string
    // Otherwise typescript will complain:
    // " type FormEntryValue cannot be assigned to string. "
    if (typeof senderEmail !== "string" || typeof message !== "string") {
      console.error("Invalid form data: we need a string!");
      return;
    }

    const data = {
      senderEmail: senderEmail,
      subject: 'New Contact Form Message',
      message: message, 
    };

    console.log("###### Heads up: Data transmitted from the form");
    console.log(data);

    try {
      const response = await sendMail({
          email: data.senderEmail,
          subject: data.subject,
          text: data.message,
      });

      if (response.success && response.messageId) {
        console.log("Email sent successfully!");
        toast.success("Email sent successfully!"); // Show success message
        // Clear the form fields
        setSenderEmail("");
        setMessage("");
      } else {
        console.error('Failed to send email:', response.message);
        toast.error(`Failed to send email: ${response.message}`); // Show error message
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to send email:', error);
        console.error(error.message || 'An error occurred.');
        toast.error('Failed to send email. Please try again.'); // Show error message
      } else {
        console.error('An unknown error occurred.');
      }
    }

  };


  return (
    <motion.section
      id="contact"
      className="mt-20 mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <div className="text-3xl font-medium capitalize mb-8 text-center">Contact me</div>

      <p className="text-slate-700 dark:text-white/80">
        Please contact me directly at{" "}
        <a className="underline">
        nachricht@sternenwanderin.quest
        </a>{" "}
        or through this form.
      </p>

      <form
        onSubmit={handleSubmit} // Call the handleSubmit function on submit
        className="mt-10 flex flex-col dark:text-black"
      >
        <input
          className="h-14 px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="senderEmail"
          type="email"
          required
          maxLength={200}
          placeholder="Your email"
        />
        <textarea
          className="h-52 my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="message"
          placeholder="Your message"
          required
          maxLength={3000}
        />
       
        <SubmitBtn />
      </form>
    </motion.section>
  );
}