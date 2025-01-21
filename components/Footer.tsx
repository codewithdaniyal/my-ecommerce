import React from "react";
import Container from "./Container";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa"; // Import icons

const Footer = () => {
  return (
    <div className="bg-lightBg text-sm">
      <Container className="py-5">
        <footer className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p className="text-gray-500">
            Copyright © 2024{" "}
            <span className="text-black font-semibold">DaniyalAhmed</span> all
            rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition"
            >
              <FaInstagram />
            </a>
          </div>
        </footer>
      </Container>
    </div>
  );
};

export default Footer;
