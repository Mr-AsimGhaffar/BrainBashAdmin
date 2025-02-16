import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-around items-center px-4">
        <div className="flex space-x-6">
          <a href="#" className="hover:underline">
            About Us
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </div>

        <div className="flex space-x-4">
          <a href="#" className="text-white text-lg">
            <FaFacebook />
          </a>
          <a href="#" className="text-white text-lg">
            <FaInstagram />
          </a>
          <a href="#" className="text-white text-lg">
            <FaXTwitter />
          </a>
        </div>

        <div className="text-white">
          <a href="mailto:info@quizz.com" className="hover:underline">
            info@quizz.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
