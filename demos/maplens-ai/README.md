# MapLens AI — Local Store Content Engine Demo

A Next.js TypeScript application that generates auto-branded social media ads from storefront photos with real-time Google Maps integration.

## Features

- **Storefront Image Processing**: Upload and enhance business photos for advertising
- **Google Maps Integration**: Pull real-time location data, ratings, and reviews
- **Multi-Platform Ads**: Generate optimized content for Google Maps, Facebook, and Instagram
- **Brand Strategy Generation**: AI analyzes visual style and creates brand personality
- **Local SEO Focus**: Incorporates location-specific appeal and offers
- **Sample Locations**: Pre-loaded examples for quick testing

## Concept

MapLens AI helps small retailers, restaurants, and local businesses create scroll-stopping social media ads automatically. Upload a storefront photo and provide business details, and the AI:

1. **Enhances the photo** - Professional styling for advertising
2. **Analyzes location data** - Gets ratings, reviews, popular times from Maps
3. **Creates brand strategy** - Generates personality, messaging, and taglines
4. **Generates platform ads** - Optimized content for each social platform
5. **Adds local appeal** - Incorporates neighborhood and community focus

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI**: Tailwind CSS with modern React components
- **Backend**: Next.js API routes
- **AI**: Gemini AI Toolkit (gemini-ai-toolkit)
- **Maps**: Google Maps Grounding API integration
- **Image Processing**: AI-powered enhancement and analysis

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Add your Gemini API key:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Routes

- `POST /api/generate-ad` - Generate local business ads
- `GET /api/sample-locations` - Get pre-loaded sample business locations

## Demo Flow

1. **Choose Sample Location**: Click any pre-loaded business for instant setup
2. **Or Enter Details**: Manually input business name, address, coordinates
3. **Upload Photo**: Add storefront image (optional but recommended)
4. **Add Offers**: Include special promotions or deals
5. **Select Platforms**: Choose target social media platforms
6. **Generate**: AI creates branded content and platform-specific ads

## Features Demonstrated

- Image analysis and enhancement
- Google Maps data integration
- Multi-platform content optimization
- Brand strategy generation
- Local business marketing automation
- Real-time API integration

## Business Value

Perfect for:
- **Local Restaurants**: Create Instagram-worthy food photos with location appeal
- **Retail Stores**: Generate Facebook ads highlighting unique products
- **Service Businesses**: Build Google Maps listings with professional branding
- **Small Businesses**: Scale content creation without design expertise
- **Marketing Agencies**: Quick local business content generation

## Sample Locations Included

- Joe's Coffee Shop (Restaurant)
- Maria's Italian Kitchen (Restaurant)
- Tech Hub Electronics (Retail)
- Bella Spa & Wellness (Spa)
- Mike's Auto Repair (Automotive)

## Location Data Integration

The system integrates with Google Maps to provide:
- **Real Ratings**: Current star ratings from Google
- **Review Summaries**: Key review themes and sentiments
- **Popular Times**: When the business is busiest
- **Local Context**: Neighborhood and area information

## Platform Optimizations

**Google Maps**: Static images with overlay text for business listings
**Facebook**: Carousel ads with local appeal and calls-to-action
**Instagram**: Visual Stories and feed posts optimized for mobile

## Future Enhancements

- Voice narration for video ads
- Automated posting to social platforms
- Analytics and performance tracking
- A/B testing for ad variations
- Integration with business listing platforms

## License

Apache-2.0