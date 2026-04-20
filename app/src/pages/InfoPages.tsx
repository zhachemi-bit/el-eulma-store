import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function PageLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
            {title}
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-8 prose prose-green max-w-none"
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}

export function FAQ() {
  return (
    <PageLayout title="Frequently Asked Questions">
      <h3 className="text-xl font-semibold mb-2">How do I register as a vendor?</h3>
      <p className="mb-6 text-gray-700">You can become a vendor by clicking on "Become a Vendor" and filling out your business information. We will verify your application within 48 hours.</p>

      <h3 className="text-xl font-semibold mb-2">What happens after I place an order?</h3>
      <p className="mb-6 text-gray-700">Your order will be verified by our team. If you selected Cash on Delivery, a representative will call you. We will then handle the logistics with the vendor and ship your goods.</p>

      <h3 className="text-xl font-semibold mb-2">Are prices guaranteed?</h3>
      <p className="mb-6 text-gray-700">Prices are wholesale prices set directly by the authorized vendors in El Eulma market.</p>
    </PageLayout>
  );
}

export function ShippingInfo() {
  return (
    <PageLayout title="Logistics Framework">
      <h3 className="text-xl font-semibold mb-2">58 Wilaya Coverage</h3>
      <p className="mb-4 text-gray-700">We provide extensive wholesale logistics across all 58 wilayas in Algeria. Our integrated logistics partners specialize in bulk shipments to ensure minimal damage and proper handling of large goods (like refrigerators, palettes of IT equipment, etc).</p>
      
      <h3 className="text-xl font-semibold mb-2">Delivery Times</h3>
      <ul className="list-disc pl-5 mb-4 text-gray-700">
        <li><strong>North:</strong> 24-48 Hours</li>
        <li><strong>High Plateaus:</strong> 48-72 Hours</li>
        <li><strong>South:</strong> 3-5 Business Days</li>
      </ul>
      
      <h3 className="text-xl font-semibold mb-2">Tracking</h3>
      <p className="mb-4 text-gray-700">Once your order status changes to "Shipped", you will find tracking details in your Account page under recent orders.</p>
    </PageLayout>
  );
}

export function ReturnsPolicy() {
  return (
    <PageLayout title="Reclamation Policy (Returns)">
      <h3 className="text-xl font-semibold mb-2">7-Day Verification Policy</h3>
      <p className="mb-4 text-gray-700">Given the nature of wholesale operations, buyers have 7 days upon delivery to verify their batch. Any complaints regarding defective units or missing items must be submitted via the Support Center.</p>
      
      <h3 className="text-xl font-semibold mb-2">Eligibility for Refunds</h3>
      <ul className="list-disc pl-5 mb-4 text-gray-700">
        <li>Items significantly different from the vendor's description.</li>
        <li>Defective batches that fail fundamental functionality tests.</li>
        <li>Lost items during transit.</li>
      </ul>
      
      <p className="text-gray-700 mt-4">For immediate inquiries, contact our central nexus via email or phone as listed in the footer.</p>
    </PageLayout>
  );
}

export function Terms() {
  return (
    <PageLayout title="Terms of Service">
      <p className="mb-4 text-gray-700">Welcome to El Eulma Store. By using our platform, you agree to comply with our wholesale and purchasing conditions. The platform acts primarily as a digital connector and logistics facilitator between registered El Eulma wholesalers and nationwide buyers.</p>
      <p className="text-gray-700">All prices, availability, and fulfillment logic are subject to validation upon checkout.</p>
    </PageLayout>
  );
}

export function Privacy() {
  return (
    <PageLayout title="Privacy Policy">
      <p className="mb-4 text-gray-700">Your privacy is important to us. We securely store your business address, phone number, and commercial registration details purely for the intent of facilitating commerce.</p>
      <p className="text-gray-700">We do not sell data to third-party ad networks.</p>
    </PageLayout>
  );
}
