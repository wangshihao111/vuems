import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { resetPublicUrls } from './configStore';

export default function initMicroConfig(): void {
  (<any>window).Vue = Vue;
  (<any>window).Vuex = Vuex;
  (<any>window).VueRouter = VueRouter;
  const urls = (process.env.MICRO_PUBLIC_URL || '').split(',').map(v => v.trim());
  resetPublicUrls(urls);
}