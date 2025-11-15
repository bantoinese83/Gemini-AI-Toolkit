import { NextResponse } from 'next/server';

export async function GET() {
  const sampleLocations = [
    {
      name: "Joe's Coffee Shop",
      address: "123 Main St, Anytown, USA",
      lat: 40.7128,
      lng: -74.0060,
      type: "restaurant"
    },
    {
      name: "Maria's Italian Kitchen",
      address: "456 Oak Ave, Somewhere, USA",
      lat: 34.0522,
      lng: -118.2437,
      type: "restaurant"
    },
    {
      name: "Tech Hub Electronics",
      address: "789 Pine St, Elsewhere, USA",
      lat: 41.8781,
      lng: -87.6298,
      type: "retail"
    },
    {
      name: "Bella Spa & Wellness",
      address: "321 Elm St, Wellness City, USA",
      lat: 37.7749,
      lng: -122.4194,
      type: "spa"
    },
    {
      name: "Mike's Auto Repair",
      address: "654 Mechanic Ave, Auto Town, USA",
      lat: 39.7392,
      lng: -104.9903,
      type: "automotive"
    }
  ];

  return NextResponse.json(sampleLocations);
}
