
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/hero-section';
import { NotificationSection } from '@/components/home/notification-section';
import { GalleryPreview } from '@/components/home/gallery-preview';
import { MaterialsPreview } from '@/components/home/materials-preview';
import { VisionSection } from '@/components/home/vision-section';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <VisionSection />
      <NotificationSection />
      <GalleryPreview />
      <MaterialsPreview />
    </MainLayout>
  );
};

export default Index;
