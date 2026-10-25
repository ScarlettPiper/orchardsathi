// Regional Kashmir Apple Belt Weather Controller
exports.getOrchardWeather = async (req, res) => {
  try {
    const district = req.query.district || 'Shopian';

    const weatherProfiles = {
      'Shopian': {
        district: 'Shopian (Temperate High-Altitude Belt)',
        tempC: 18.4,
        condition: 'Partly Cloudy with Scattered Showers',
        icon: 'rain-cloud',
        humidity: 82,
        rainfallMm: 4.2,
        windKmh: 9,
        scabRisk: 'High',
        scabRiskReason: '82% relative humidity and 18°C temperature create high Mills period infection window for Venturia inaequalis.',
        actionAdvisory: 'Avoid applying contact sprays during active rain; inspect foliage for primary scab lesions 48 hours post-rainfall.',
        forecast: [
          { day: 'Today', temp: '18°C / 7°C', condition: 'Scattered Showers', rainChance: '65%' },
          { day: 'Tomorrow', temp: '19°C / 6°C', condition: 'Partly Cloudy', rainChance: '25%' },
          { day: 'Wed', temp: '21°C / 8°C', condition: 'Sunny & Clear', rainChance: '10%' },
        ]
      },
      'Baramulla': {
        district: 'Baramulla / Sopore (North Valley Fruit Belt)',
        tempC: 20.1,
        condition: 'Pleasant & Mild Breeze',
        icon: 'sun-cloud',
        humidity: 68,
        rainfallMm: 0.0,
        windKmh: 12,
        scabRisk: 'Low to Moderate',
        scabRiskReason: 'Dry conditions reduce spore germination. Ideal window for routine nutrient and preventive sprays.',
        actionAdvisory: 'Suitable conditions for foliar calcium or boron spray in developing fruit blocks.',
        forecast: [
          { day: 'Today', temp: '20°C / 9°C', condition: 'Clear Sky', rainChance: '15%' },
          { day: 'Tomorrow', temp: '21°C / 9°C', condition: 'Sunny', rainChance: '5%' },
          { day: 'Wed', temp: '19°C / 8°C', condition: 'Breezy', rainChance: '10%' },
        ]
      },
      'Srinagar': {
        district: 'Srinagar / Central Kashmir Belt',
        tempC: 21.0,
        condition: 'Sunny Intervals',
        icon: 'sun',
        humidity: 62,
        rainfallMm: 0.0,
        windKmh: 11,
        scabRisk: 'Low',
        scabRiskReason: 'Warm sunny weather disfavors fungal ascospore dissemination.',
        actionAdvisory: 'Standard irrigation intervals recommended. Check soil moisture in young saplings.',
        forecast: [
          { day: 'Today', temp: '21°C / 10°C', condition: 'Sunny', rainChance: '10%' },
          { day: 'Tomorrow', temp: '22°C / 11°C', condition: 'Clear', rainChance: '10%' },
          { day: 'Wed', temp: '20°C / 9°C', condition: 'Cloudy', rainChance: '20%' },
        ]
      }
    };

    const data = weatherProfiles[district] || weatherProfiles['Shopian'];

    return res.json({
      success: true,
      isDemo: true,
      dataSource: 'Kashmir Agro-Meteorological Advisory Service (Simulated Dataset for Review 1)',
      weather: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch weather: ' + error.message,
    });
  }
};
