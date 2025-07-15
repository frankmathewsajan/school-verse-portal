
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/hero-section';
import { NotificationSection } from '@/components/home/notification-section';
import { GalleryPreview } from '@/components/home/gallery-preview';
import { MaterialsPreview } from '@/components/home/materials-preview';
import { useLanguage } from "../App";

const Index = () => {
  const { language } = useLanguage();
  const t = {
    hero: {
      en: "Welcome to St. G. D. Convent School",
      hi: "सेंट जी. डी. कॉन्वेंट स्कूल में आपका स्वागत है"
    },
    notifications: {
      en: "Notifications",
      hi: "सूचनाएँ"
    },
    gallery: {
      en: "Gallery Preview",
      hi: "गैलरी पूर्वावलोकन"
    },
    materials: {
      en: "Materials Preview",
      hi: "सामग्री पूर्वावलोकन"
    }
  };
  return (
    <MainLayout>
      <HeroSection title={t.hero[language] || t.hero.en} />
      <NotificationSection title={t.notifications[language] || t.notifications.en} />
      <GalleryPreview title={t.gallery[language] || t.gallery.en} />
      <MaterialsPreview title={t.materials[language] || t.materials.en} />
    </MainLayout>
  );
};

export default Index;
