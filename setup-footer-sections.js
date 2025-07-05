// Simple script to create footer_sections table and insert default data
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://plgjavfrwcphrehmthdv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2phdmZyd2NwaHJlaG10aGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODE3ODcsImV4cCI6MjA2NzI1Nzc4N30.73hjYMk1hrqiuhFV-AoVtbRdYc6biciDqnFhtz4sq5o'
);

async function setupFooterSections() {
  console.log('Creating footer_sections table...');
  
  // Insert default footer sections directly
  const defaultSections = [
    {
      title: 'About St.G.D Convent School',
      section_type: 'custom',
      content: {
        text: 'Empowering students through innovative education and comprehensive learning experiences since 2015.'
      },
      display_order: 1,
      is_active: true
    },
    {
      title: 'Quick Links',
      section_type: 'links',
      content: {
        items: [
          { label: 'Home', url: '/' },
          { label: 'About Us', url: '/about' },
          { label: 'Gallery', url: '/gallery' },
          { label: 'Learning Materials', url: '/materials' },
          { label: 'Admin Portal', url: '/admin' }
        ]
      },
      display_order: 2,
      is_active: true
    },
    {
      title: 'Contact Us',
      section_type: 'contact',
      content: {
        address: 'Siroli, Road Dhanouli, Agra, Uttar Pradesh',
        phone: '8077422014, 9084792142',
        email: 'st.g.dconventschool1@gmail.com'
      },
      display_order: 3,
      is_active: true
    },
    {
      title: 'Follow Us',
      section_type: 'social',
      content: {
        platforms: [
          { name: 'Facebook', url: 'https://facebook.com/stgdconventschool', icon: 'facebook' },
          { name: 'Twitter', url: 'https://twitter.com/stgdconventschool', icon: 'twitter' },
          { name: 'Instagram', url: 'https://instagram.com/stgdconventschool', icon: 'instagram' },
          { name: 'YouTube', url: 'https://youtube.com/stgdconventschool', icon: 'youtube' }
        ]
      },
      display_order: 4,
      is_active: true
    }
  ];

  try {
    // Try to insert the sections
    const { data, error } = await supabase
      .from('footer_sections')
      .insert(defaultSections)
      .select();

    if (error) {
      console.error('Error inserting footer sections:', error);
      console.log('This might be because the table does not exist. Please create it manually in Supabase.');
    } else {
      console.log('Successfully created footer sections:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

setupFooterSections();
