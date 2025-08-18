-- Create sample blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Design Tips', 'design-tips', 'Practical advice and tips for better design'),
('Case Studies', 'case-studies', 'Real project insights and success stories'),
('Industry Trends', 'industry-trends', 'Latest trends and insights in design and branding'),
('Branding', 'branding', 'Brand strategy and identity design insights'),
('Web Development', 'web-development', 'Website development tips and best practices')
ON CONFLICT (slug) DO NOTHING;

-- Create sample blog articles
WITH categories AS (
  SELECT id, slug FROM blog_categories WHERE slug IN ('design-tips', 'case-studies', 'industry-trends', 'branding', 'web-development')
)
INSERT INTO blog_articles (
  title, 
  slug, 
  excerpt, 
  content, 
  status, 
  category_id, 
  published_at,
  featured_image,
  meta_title,
  meta_description,
  meta_keywords
) VALUES
(
  'The Psychology Behind Effective Brand Colors',
  'psychology-brand-colors',
  'Discover how color psychology influences consumer behavior and learn to choose the perfect palette for your brand.',
  '<h2>Understanding Color Psychology in Branding</h2><p>Color psychology plays a crucial role in how consumers perceive and interact with brands. Research shows that up to 90% of snap judgments about products are based on color alone.</p><h3>Primary Colors and Their Impact</h3><p>Red evokes urgency and excitement, making it perfect for call-to-action buttons. Blue builds trust and reliability, which is why many financial institutions use it. Green represents growth and nature, ideal for eco-friendly brands.</p><h3>Choosing Your Brand Palette</h3><p>When selecting colors for your brand, consider your target audience, industry standards, and the emotions you want to evoke. Test different combinations to see what resonates best with your customers.</p>',
  'published',
  (SELECT id FROM categories WHERE slug = 'branding'),
  NOW() - INTERVAL '5 days',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=400&fit=crop',
  'Color Psychology in Branding | Tukang Design',
  'Learn how color psychology influences consumer behavior and choose the perfect brand palette for your business.',
  'color psychology, brand colors, branding, design psychology'
),
(
  '5 Web Design Trends That Actually Convert',
  'web-design-trends-convert',
  'Not all design trends lead to better conversions. Here are 5 proven trends that actually improve user experience and drive results.',
  '<h2>Conversion-Focused Design Trends</h2><p>While many design trends come and go, some have proven staying power because they genuinely improve user experience and conversion rates.</p><h3>1. Minimalist Navigation</h3><p>Clean, simple navigation reduces cognitive load and helps users find what they need faster.</p><h3>2. Mobile-First Design</h3><p>With mobile traffic dominating, designing for mobile first ensures optimal experience across all devices.</p><h3>3. Interactive Elements</h3><p>Subtle animations and micro-interactions guide users and provide feedback, improving overall user experience.</p>',
  'published',
  (SELECT id FROM categories WHERE slug = 'web-development'),
  NOW() - INTERVAL '3 days',
  'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=400&fit=crop',
  'Web Design Trends That Convert | Tukang Design',
  'Discover 5 proven web design trends that improve user experience and drive better conversion rates.',
  'web design trends, conversion optimization, user experience, web development'
),
(
  'Case Study: Rebranding Success Story',
  'rebranding-success-story',
  'How we helped a local business increase their revenue by 150% through strategic rebranding and website redesign.',
  '<h2>The Challenge</h2><p>Our client, a family-owned restaurant, was struggling with outdated branding that failed to reflect their modern approach to traditional cuisine.</p><h3>Our Approach</h3><p>We conducted extensive market research and competitor analysis to develop a brand strategy that would appeal to both traditional customers and a younger demographic.</p><h3>The Results</h3><p>Within 6 months of launching the new brand and website, our client saw a 150% increase in online orders and a 45% increase in foot traffic.</p><h3>Key Takeaways</h3><p>Strategic rebranding can breathe new life into established businesses and open up new market opportunities.</p>',
  'published',
  (SELECT id FROM categories WHERE slug = 'case-studies'),
  NOW() - INTERVAL '1 week',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
  'Restaurant Rebranding Case Study | Tukang Design',
  'See how strategic rebranding helped a local restaurant increase revenue by 150% through better brand positioning.',
  'rebranding case study, restaurant branding, brand strategy, success story'
),
(
  'Common Branding Mistakes Small Businesses Make',
  'common-branding-mistakes',
  'Avoid these 7 critical branding mistakes that could be costing your small business customers and credibility.',
  '<h2>7 Branding Mistakes to Avoid</h2><p>Small businesses often make branding mistakes that can seriously impact their growth and credibility. Here are the most common ones we see.</p><h3>1. Inconsistent Visual Identity</h3><p>Using different fonts, colors, and styles across platforms confuses customers and weakens brand recognition.</p><h3>2. Neglecting Target Audience</h3><p>Designing for everyone means appealing to no one. Define your ideal customer and speak directly to them.</p><h3>3. Copying Competitors</h3><p>While inspiration is good, copying makes you forgettable. Find your unique value proposition and express it visually.</p>',
  'published',
  (SELECT id FROM categories WHERE slug = 'design-tips'),
  NOW() - INTERVAL '2 weeks',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  'Common Branding Mistakes | Tukang Design',
  'Avoid these 7 critical branding mistakes that small businesses make. Learn how to build a strong, consistent brand.',
  'branding mistakes, small business branding, brand consistency, design tips'
),
(
  'The Future of Logo Design in 2024',
  'future-logo-design-2024',
  'Explore emerging trends in logo design and learn how to create timeless brand marks that work across all platforms.',
  '<h2>Logo Design Trends for 2024</h2><p>As we move into 2024, logo design continues to evolve with new technologies and changing consumer preferences.</p><h3>Adaptive Logos</h3><p>Logos that change based on context or platform are becoming more popular, offering flexibility while maintaining brand recognition.</p><h3>Sustainable Design</h3><p>Eco-conscious design choices, including simplified logos that use less ink and energy, are gaining traction.</p><h3>Cultural Sensitivity</h3><p>Brands are paying more attention to cultural context and ensuring their logos work across global markets.</p>',
  'published',
  (SELECT id FROM categories WHERE slug = 'industry-trends'),
  NOW() - INTERVAL '4 days',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
  'Future of Logo Design 2024 | Tukang Design',
  'Discover emerging logo design trends for 2024 and learn how to create timeless brand marks for modern businesses.',
  'logo design trends, future of design, brand marks, design 2024'
),
(
  'Building a Design System That Scales',
  'building-design-system-scales',
  'Learn how to create a comprehensive design system that grows with your business and ensures consistency across all touchpoints.',
  '<h2>Why Design Systems Matter</h2><p>As businesses grow, maintaining visual consistency becomes increasingly challenging. A well-structured design system is the solution.</p><h3>Key Components</h3><p>Typography scales, color palettes, spacing rules, and component libraries form the foundation of any good design system.</p><h3>Implementation Strategy</h3><p>Start small with core elements and gradually expand. Document everything and ensure team buy-in for successful adoption.</p><h3>Maintenance and Evolution</h3><p>Design systems are living documents that should evolve with your brand and business needs.</p>',
  'draft',
  (SELECT id FROM categories WHERE slug = 'design-tips'),
  NULL,
  'https://images.unsplash.com/photo-1558655146-364adaf25c81?w=800&h=400&fit=crop',
  'Building Scalable Design Systems | Tukang Design',
  'Create comprehensive design systems that scale with your business and ensure consistency across all brand touchpoints.',
  'design systems, scalable design, brand consistency, design process'
);

-- Add sample tags for articles
WITH articles AS (
  SELECT id, slug FROM blog_articles WHERE slug IN (
    'psychology-brand-colors', 'web-design-trends-convert', 'rebranding-success-story', 
    'common-branding-mistakes', 'future-logo-design-2024', 'building-design-system-scales'
  )
)
INSERT INTO article_tags (article_id, tag) VALUES
((SELECT id FROM articles WHERE slug = 'psychology-brand-colors'), 'color theory'),
((SELECT id FROM articles WHERE slug = 'psychology-brand-colors'), 'branding'),
((SELECT id FROM articles WHERE slug = 'psychology-brand-colors'), 'psychology'),
((SELECT id FROM articles WHERE slug = 'web-design-trends-convert'), 'web design'),
((SELECT id FROM articles WHERE slug = 'web-design-trends-convert'), 'conversion'),
((SELECT id FROM articles WHERE slug = 'web-design-trends-convert'), 'UX'),
((SELECT id FROM articles WHERE slug = 'rebranding-success-story'), 'case study'),
((SELECT id FROM articles WHERE slug = 'rebranding-success-story'), 'rebranding'),
((SELECT id FROM articles WHERE slug = 'rebranding-success-story'), 'restaurant'),
((SELECT id FROM articles WHERE slug = 'common-branding-mistakes'), 'small business'),
((SELECT id FROM articles WHERE slug = 'common-branding-mistakes'), 'mistakes'),
((SELECT id FROM articles WHERE slug = 'common-branding-mistakes'), 'tips'),
((SELECT id FROM articles WHERE slug = 'future-logo-design-2024'), 'logo design'),
((SELECT id FROM articles WHERE slug = 'future-logo-design-2024'), 'trends'),
((SELECT id FROM articles WHERE slug = 'future-logo-design-2024'), '2024'),
((SELECT id FROM articles WHERE slug = 'building-design-system-scales'), 'design systems'),
((SELECT id FROM articles WHERE slug = 'building-design-system-scales'), 'scalability'),
((SELECT id FROM articles WHERE slug = 'building-design-system-scales'), 'process');