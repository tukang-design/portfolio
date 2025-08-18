-- Update existing portfolio to published status
UPDATE portfolios SET status = 'published' WHERE title = 'Kapitani';

-- Add more portfolio items with published status
INSERT INTO portfolios (title, slug, category, description, details, client, timeline, status, services) VALUES 
(
  'Raisuri Tech Solutions',
  'raisuri-tech-solutions',
  'Web Development',
  'Modern web application for a tech startup focused on AI solutions and data analytics.',
  'Built a comprehensive web platform featuring real-time dashboards, user authentication, and API integrations. The project included custom animations, responsive design, and performance optimization.',
  'Raisuri Tech',
  '3 months',
  'published',
  '["Web Development", "UI/UX Design", "API Integration", "Performance Optimization"]'
),
(
  'SAG Logistics Rebrand',
  'sag-logistics-rebrand',
  'Brand Design',
  'Complete brand identity redesign for a leading logistics company, including logo, website, and marketing materials.',
  'Developed a modern, professional brand identity that reflects trust and efficiency. Created comprehensive brand guidelines, business cards, letterheads, and digital assets.',
  'SAG Logistics',
  '6 weeks',
  'published',
  '["Brand Design", "Logo Design", "Print Design", "Digital Assets"]'
),
(
  'Youthopia Festival',
  'youthopia-festival',
  'Event Branding',
  'Creative branding and promotional materials for a youth-focused music and arts festival.',
  'Designed vibrant, energetic branding that captures the spirit of youth culture. Created posters, social media content, merchandise designs, and festival signage.',
  'Youthopia Events',
  '4 weeks',
  'published',
  '["Event Branding", "Graphic Design", "Social Media", "Merchandise Design"]'
),
(
  'TechStart Mobile App',
  'techstart-mobile-app',
  'Mobile Development',
  'Cross-platform mobile application for a fintech startup offering digital wallet services.',
  'Developed a secure, user-friendly mobile app with biometric authentication, real-time transactions, and comprehensive financial tracking. Implemented advanced security measures and smooth UX.',
  'TechStart Solutions',
  '4 months',
  'published',
  '["Mobile Development", "UI/UX Design", "Security Implementation", "API Development"]'
);

-- Add portfolio images for the existing portfolios
INSERT INTO portfolio_images (portfolio_id, image_url, alt_text, is_main, sort_order) 
SELECT 
  p.id,
  CASE 
    WHEN p.slug = 'kapitani' THEN '/src/assets/portfolio-kapitani-new.png'
    WHEN p.slug = 'raisuri-tech-solutions' THEN '/src/assets/portfolio-raisuri-new.png'
    WHEN p.slug = 'sag-logistics-rebrand' THEN '/src/assets/portfolio-sag-new.png'
    WHEN p.slug = 'youthopia-festival' THEN '/src/assets/portfolio-youthopia-new.png'
    ELSE '/src/assets/portfolio-kapitani-new.png'
  END as image_url,
  'Portfolio project showcase image' as alt_text,
  true as is_main,
  0 as sort_order
FROM portfolios p 
WHERE p.slug IN ('kapitani', 'raisuri-tech-solutions', 'sag-logistics-rebrand', 'youthopia-festival');