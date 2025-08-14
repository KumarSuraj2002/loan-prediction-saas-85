
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();
  return (
    <footer className="border-t">
      <div className="container px-4 md:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-primary mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm sm:text-base">FB</div>
              <span>{settings.general.site_title}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {settings.general.about_us}
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {settings.contacts.social_links.facebook && (
                <Button size="icon" variant="ghost" asChild>
                  <a href={settings.contacts.social_links.facebook} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </a>
                </Button>
              )}
              {settings.contacts.social_links.instagram && (
                <Button size="icon" variant="ghost" asChild>
                  <a href={settings.contacts.social_links.instagram} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </a>
                </Button>
              )}
              {settings.contacts.social_links.twitter && (
                <Button size="icon" variant="ghost" asChild>
                  <a href={settings.contacts.social_links.twitter} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </a>
                </Button>
              )}
              {settings.contacts.social_links.linkedin && (
                <Button size="icon" variant="ghost" asChild>
                  <a href={settings.contacts.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="M9 12h4v8H9z"></path>
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 sm:col-span-2 lg:col-span-3">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/#loan-prediction" className="text-muted-foreground hover:text-foreground">Loan Prediction</a></li>
                <li><a href="/#bank-recommendation" className="text-muted-foreground hover:text-foreground">Bank Finder</a></li>
                <li><Link to="/calculator" className="text-muted-foreground hover:text-foreground">EMI Calculator</Link></li>
                <li><a href="/#features" className="text-muted-foreground hover:text-foreground">Financial Planning</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="/guides" className="text-muted-foreground hover:text-foreground">Financial Guides</Link></li>
                <li><Link to="/calculator" className="text-muted-foreground hover:text-foreground">EMI Calculator</Link></li>
                <li><Link to="/api-docs" className="text-muted-foreground hover:text-foreground">API Documentation</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link to="/press" className="text-muted-foreground hover:text-foreground">Press</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t text-sm text-muted-foreground">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            &copy; 2024 {settings.general.site_title}. All rights reserved.
          </div>
          <div className="flex gap-4 text-center">
            <Link to="/about" className="hover:text-foreground">Terms</Link>
            <Link to="/about" className="hover:text-foreground">Privacy</Link>
            <Link to="/about" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
