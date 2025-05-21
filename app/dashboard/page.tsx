"use client";
import { useState, useEffect, Suspense } from 'react';
import DashboardContent from '@/components/DashboardContent';
import DashboardFallback from '@/components/DashboardFallback';


export default function Dashboard() {
  return (
    <div className="bg-black min-h-screen">
      <Suspense fallback={<DashboardFallback />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}