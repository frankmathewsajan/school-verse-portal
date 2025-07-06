
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/hero-section';
import { NotificationSection } from '@/components/home/notification-section';
import { GalleryPreview } from '@/components/home/gallery-preview';
import { MaterialsPreview } from '@/components/home/materials-preview';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <NotificationSection />
      <GalleryPreview />
      <MaterialsPreview />
    </MainLayout>
  );
};

export default Index;
