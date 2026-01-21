'use client';

import { useState, useEffect } from 'react';
import { Location, LocationCategory } from '@/app/lib/types';
import Header from '@/app/components/Header';
import FiltersPanel from '@/app/components/FiltersPanel';
import LegendPanel from '@/app/components/LegendPanel';
import PlaceCard from '@/app/components/PlaceCard';
import SnowAnimation from '@/app/components/SnowAnimation';
import YandexMap from '@/app/components/YandexMap';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeFilter, setActiveFilter] = useState<LocationCategory | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/locations');
        if (response.ok) {
          const data = await response.json();
          setLocations(data);
          return;
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }

      // Fallback to static data if API fails or returns error
      setLocations([
          {
            id: 1,
            coords: [53.9045, 27.5615],
            title: 'Сугроб №1',
            district: 'Центральный',
            size: '220 м²',
            description: 'Уютное пространство с живой музыкой и дружелюбной атмосферой. Идеально для вечерних встреч с друзьями.',
            badges: ['Музыка', 'Движ на 220 м²'],
            time: 'Обычно после 23:00',
            peak: 'Пик — пятница / суббота',
            categories: ['music', 'party'],
            popularity: 'large'
          },
          {
            id: 2,
            coords: [53.9145, 27.5715],
            title: 'Сугроб №2',
            district: 'Советский',
            size: '150 м²',
            description: 'Странное и веселое место, где всегда что-то происходит. Арт-пространство с непредсказуемой атмосферой.',
            badges: ['Странно', 'Весело'],
            time: 'Обычно после 20:00',
            peak: 'Пик — четверг / пятница',
            categories: ['weird', 'party'],
            popularity: 'medium'
          },
          {
            id: 3,
            coords: [53.8945, 27.5515],
            title: 'Сугроб №3',
            district: 'Ленинский',
            size: '80 м²',
            description: 'Тихое место для душевных разговоров за чаем или глинтвейном. Камин, книги и уютная атмосфера.',
            badges: ['Чай', 'Глинтвейн', 'Камин'],
            time: 'Обычно после 18:00',
            peak: 'Пик — выходные',
            categories: ['cozy'],
            popularity: 'small'
          },
          {
            id: 4,
            coords: [53.9245, 27.5815],
            title: 'Сугроб №4',
            district: 'Партизанский',
            size: '300 м²',
            description: 'Самое громкое место в городе! Танцпол, DJ-сеты и безудержное веселье до утра.',
            badges: ['Угар', 'Танцы', 'DJ'],
            time: 'Обычно после 00:00',
            peak: 'Пик — пятница / суббота',
            categories: ['party'],
            popularity: 'large'
          },
          {
            id: 5,
            coords: [53.8845, 27.5415],
            title: 'Сугроб №5',
            district: 'Октябрьский',
            size: '120 м²',
            description: 'Живая музыка каждый вечер. От джаза до инди-рока. Приходите насладиться звуками.',
            badges: ['Живая музыка', 'Джаз', 'Инди'],
            time: 'Обычно после 21:00',
            peak: 'Пик — среда / пятница',
            categories: ['music'],
            popularity: 'medium'
          },
          {
            id: 6,
            coords: [53.9, 27.56],
            title: 'Сугроб №6',
            district: 'Фрунзенский',
            size: '95 м²',
            description: 'Экспериментальное арт-пространство. Выставки, перформансы и необычные события.',
            badges: ['Арт', 'Перформанс', 'Выставки'],
            time: 'Обычно после 19:00',
            peak: 'Пик — суббота',
            categories: ['weird'],
            popularity: 'small'
          },
          {
            id: 7,
            coords: [53.91, 27.57],
            title: 'Сугроб №7',
            district: 'Заводской',
            size: '180 м²',
            description: 'Музыка и веселье в равных пропорциях. Танцуй и слушай одновременно!',
            badges: ['Музыка', 'Танцы'],
            time: 'Обычно после 22:00',
            peak: 'Пик — выходные',
            categories: ['music', 'party'],
            popularity: 'medium'
          },
          {
            id: 8,
            coords: [53.89, 27.55],
            title: 'Сугроб №8',
            district: 'Первомайский',
            size: '65 м²',
            description: 'Маленькое уютное кафе с отличным выбором чая и домашними сладостями.',
            badges: ['Чай', 'Кофе', 'Сладости'],
            time: 'Обычно после 14:00',
            peak: 'Пик — воскресенье',
            categories: ['cozy'],
            popularity: 'small'
          }
        ]);

      setLoading(false);
    }

    fetchLocations();
  }, []);

  const handleFilterChange = (filter: LocationCategory | null) => {
    setActiveFilter(filter);
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleClosePlaceCard = () => {
    setSelectedLocation(null);
  };

  if (loading) {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000]">
        <div className="w-12 h-12 border-4 border-accent-warm/20 border-t-accent-warm rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <YandexMap
        locations={locations}
        activeFilter={activeFilter}
        onSelectLocation={handleSelectLocation}
        selectedLocation={selectedLocation}
      />
      <SnowAnimation />
      <FiltersPanel activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      <LegendPanel />
      <PlaceCard location={selectedLocation} onClose={handleClosePlaceCard} />
    </>
  );
}
