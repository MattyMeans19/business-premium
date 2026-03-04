export default function Contact() {
  return (
    <div className="grow flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Label/Eyebrow text */}
      <span className="text-(--primary-color) font-semibold tracking-wide uppercase text-sm mb-4">
        Get In Touch
      </span>

      {/* Main Heading */}
      <h1 className="max-w-2xl text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
        Contact our business with any <span className="text-(--primary-color)">inquiries</span> you may have.
      </h1>

      {/* Contact Grid */}
      <div className="mt-16 flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        
        {/* Phone Section */}
        <div className="flex-1 p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-2">Call us directly</p>
          <a 
            href="tel:555-555-5555" 
            className="ContactLink"
          >
            555-555-5555
          </a>
        </div>

        {/* Email Section */}
        <div className="flex-1 p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-2">Send an email</p>
          <a 
            href="mailto:businessemail@email.com" 
            className="ContactLink"
          >
            businessemail@email.com
          </a>
        </div>

      </div>
      
      {/* Simple Footer/Secondary Info */}
      <p className="mt-12 text-slate-400 text-sm">
        Available Monday through Friday, 9am — 5pm MST.
      </p>
    </div>
  );
}