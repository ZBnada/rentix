import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-title-md font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to RentIX Dashboard
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <!-- Card 1: Customers -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-dark p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Customers</h4>
              <span class="text-title-md font-bold text-gray-900 dark:text-white mt-2 block">3,782</span>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
              <svg class="w-6 h-6 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
          <span class="flex items-center gap-1 text-sm font-medium text-success-600 mt-4">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            11.01%
          </span>
        </div>

        <!-- Card 2: Orders -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-dark p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Orders</h4>
              <span class="text-title-md font-bold text-gray-900 dark:text-white mt-2 block">5,359</span>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
              <svg class="w-6 h-6 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
          <span class="flex items-center gap-1 text-sm font-medium text-error-600 mt-4">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            9.05%
          </span>
        </div>

        <!-- Card 3: Revenue -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-dark p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</h4>
              <span class="text-title-md font-bold text-gray-900 dark:text-white mt-2 block">$20K</span>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
              <svg class="w-6 h-6 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <span class="flex items-center gap-1 text-sm font-medium text-success-600 mt-4">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            8.5%
          </span>
        </div>

        <!-- Card 4: Growth -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-dark p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Growth</h4>
              <span class="text-title-md font-bold text-gray-900 dark:text-white mt-2 block">75.55%</span>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
              <svg class="w-6 h-6 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
          <span class="flex items-center gap-1 text-sm font-medium text-success-600 mt-4">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            +10%
          </span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="mt-6 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div class="col-span-12">
          <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-dark p-6 shadow-sm">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to RentIX Dashboard! 🚗
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Your dashboard is now ready. Start managing your rental business efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OverviewComponent {}