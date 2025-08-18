const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-16">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-white">Tukang Design</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Professional brand design and website development. Transform your business with powerful brand assets that work. 13 years of big-league experience.
            </p>
            <div className="text-muted-foreground">
              <p className="mb-2">studio@tukang.design</p>
            </div>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Help</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#home" className="hover:text-[hsl(var(--neon-green))] transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-green))] transition-colors">Privacy</a></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Navigation</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#services" className="hover:text-[hsl(var(--neon-green))] transition-colors">Services</a></li>
              <li><a href="#work" className="hover:text-[hsl(var(--neon-green))] transition-colors">Our Work</a></li>
              <li><a href="#about" className="hover:text-[hsl(var(--neon-green))] transition-colors">About</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>© 2025 Tukang Design by TADAL STUDIO (202503200783). All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;