import React, { useState, useEffect } from "react";

export default function Contact() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // Honeypot field to catch bots
    submissionTime: 0 // Track when form started being filled
  });

  // Set initial submission time when component mounts
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      submissionTime: Date.now()
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if the email appears legitimate
  const isValidEmail = (email) => {
    // Basic check for common spam domains
    const spamDomains = ['example.com', 'test.com', 'spam.com'];
    const domain = email.split('@')[1];
    if (spamDomains.includes(domain)) return false;
    
    // Check for repetitive patterns often used by bots
    if (/(.)\1{4,}/.test(email)) return false;
    
    return true;
  };

  // Check if message contains spam signals
  const isValidMessage = (message) => {
    // Check for common spam phrases
    const spamPhrases = ['buy viagra', 'cheap seo', 'make money fast', 'casino'];
    const lowerMessage = message.toLowerCase();
    
    if (spamPhrases.some(phrase => lowerMessage.includes(phrase))) return false;
    
    // Check for excessive URLs (common in spam)
    const urlCount = (message.match(/https?:\/\//g) || []).length;
    if (urlCount > 3) return false;
    
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("");
    
    // Anti-spam checks
    
    // 1. Check if honeypot field is filled (bots often complete all fields)
    if (formData.honeypot) {
      console.log("Honeypot triggered");
      // Simulate success to the bot but don't actually submit
      setTimeout(() => {
        setResult("Thank you! Your message has been sent successfully.");
        setLoading(false);
      }, 1000);
      return;
    }
    
    // 2. Check for submission time (bots usually submit forms very quickly)
    const timeElapsed = Date.now() - formData.submissionTime;
    if (timeElapsed < 3000) { // Less than 3 seconds to fill the form
      console.log("Time-based protection triggered");
      setTimeout(() => {
        setResult("Please try again.");
        setLoading(false);
      }, 1500);
      return;
    }
    
    // 3. Check content for spam signals
    if (!isValidEmail(formData.email) || !isValidMessage(formData.message)) {
      console.log("Content protection triggered");
      setTimeout(() => {
        setResult("Your message couldn't be sent. Please check your information and try again.");
        setLoading(false);
      }, 1000);
      return;
    }
    
    // All checks passed, proceed with actual form submission
    
    // Remove the honeypot field from submission
    const submitData = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      access_key: "306ad930-9628-48c8-821e-b80ab9821199"
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        setResult("Thank you! Your message has been sent successfully.");
        // Reset form fields
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          honeypot: "",
          submissionTime: Date.now()
        });
      } else {
        console.log("Error", data);
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResult("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Contact Us</h2>
          <p className="text-lg text-gray-600">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Honeypot field - hidden from humans but bots will fill it */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="honeypot">Skip this field</label>
                <input
                  type="text"
                  name="honeypot"
                  id="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm">
                  <p className="text-gray-500">
                    We'll get back to you as soon as possible
                  </p>
                </div>
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className={`px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-md ${result.includes("Thank you") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            <p className="text-center font-medium">{result}</p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Phone</h3>
            <p className="mt-2 text-gray-600">+255 123 456 789</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Email</h3>
            <p className="mt-2 text-gray-600">info@zurutz.com</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center sm:col-span-2 lg:col-span-1">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Address</h3>
            <p className="mt-2 text-gray-600">123 Zuru Street, Dar es Salaam, Tanzania</p>
          </div>
        </div>
      </div>
    </div>
  );
}