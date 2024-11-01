// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadItinerary: () => JSON.parse(localStorage.getItem('itinerary')) || [],
  saveItinerary: (itinerary) => localStorage.setItem('itinerary', JSON.stringify(itinerary)),
});
