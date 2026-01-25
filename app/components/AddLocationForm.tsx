'use client';

import { useState } from 'react';

interface AddLocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLocationForm({ isOpen, onClose, onSuccess }: AddLocationFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    mapLink: '',
    description: '',
    size: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const extractCoordinatesFromMapLink = async (link: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      // Try to extract coordinates locally first
      const localCoords = tryExtractCoordinatesLocally(link);
      if (localCoords) {
        return localCoords;
      }

      // If local extraction failed, try backend (for short links and other formats)
      try {
        const response = await fetch('/api/parse-map-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: link }),
        });

        if (response.ok) {
          const coords = await response.json();
          return coords;
        }
      } catch (backendError) {
        console.error('Backend parsing failed:', backendError);
      }

      return null;
    } catch {
      return null;
    }
  };

  const tryExtractCoordinatesLocally = (link: string): { lat: number; lng: number } | null => {
    try {
      // Yandex Maps format: https://yandex.by/maps/?ll=27.561500%2C53.904500&z=15
      const llMatch = link.match(/ll=([\d.]+)%2C([\d.]+)/);
      if (llMatch) {
        return { lng: parseFloat(llMatch[1]), lat: parseFloat(llMatch[2]) };
      }

      // Yandex Maps alternative format with comma: ?ll=27.561500,53.904500
      const llCommaMatch = link.match(/ll=([\d.]+),([\d.]+)/);
      if (llCommaMatch) {
        return { lng: parseFloat(llCommaMatch[1]), lat: parseFloat(llCommaMatch[2]) };
      }

      // Google Maps format: https://www.google.com/maps/@53.904500,27.561500,15z
      const googleMatch = link.match(/@([\d.]+),([\d.]+)/);
      if (googleMatch) {
        return { lat: parseFloat(googleMatch[1]), lng: parseFloat(googleMatch[2]) };
      }

      // Google Maps place format: /maps/place/.../@lat,lng
      const googlePlaceMatch = link.match(/\/maps\/place\/[^/]+\/@([\d.]+),([\d.]+)/);
      if (googlePlaceMatch) {
        return { lat: parseFloat(googlePlaceMatch[1]), lng: parseFloat(googlePlaceMatch[2]) };
      }

      // Coordinates in query params: ?lat=53.904500&lng=27.561500
      const queryLatLngMatch = link.match(/[?&]lat=([\d.]+).*[?&]lng=([\d.]+)/);
      if (queryLatLngMatch) {
        return { lat: parseFloat(queryLatLngMatch[1]), lng: parseFloat(queryLatLngMatch[2]) };
      }

      // Alternative format: ?latitude=53.904500&longitude=27.561500
      const queryLatitudeLongitudeMatch = link.match(/[?&]latitude=([\d.]+).*[?&]longitude=([\d.]+)/);
      if (queryLatitudeLongitudeMatch) {
        return { lat: parseFloat(queryLatitudeLongitudeMatch[1]), lng: parseFloat(queryLatitudeLongitudeMatch[2]) };
      }

      // Yandex Maps whatshere format: ?whatshere[point]=27.561500,53.904500
      const whatsHereMatch = link.match(/whatshere\[point\]=([\d.]+),([\d.]+)/);
      if (whatsHereMatch) {
        return { lng: parseFloat(whatsHereMatch[1]), lat: parseFloat(whatsHereMatch[2]) };
      }

      // 2GIS format: https://2gis.by/minsk/geo/27.561500%2C53.904500
      const dgisMatch = link.match(/\/geo\/([\d.]+)%2C([\d.]+)/);
      if (dgisMatch) {
        return { lng: parseFloat(dgisMatch[1]), lat: parseFloat(dgisMatch[2]) };
      }

      // 2GIS alternative format with comma
      const dgisCommaMatch = link.match(/\/geo\/([\d.]+),([\d.]+)/);
      if (dgisCommaMatch) {
        return { lng: parseFloat(dgisCommaMatch[1]), lat: parseFloat(dgisCommaMatch[2]) };
      }

      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.title.trim() || !formData.mapLink.trim() || !formData.size.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Validate size length
    if (formData.size.trim().length > 20) {
      setError('Размер не должен превышать 20 символов');
      return;
    }

    setIsSubmitting(true);

    // Extract coordinates from map link
    const coords = await extractCoordinatesFromMapLink(formData.mapLink);
    if (!coords) {
      setError('Не удалось извлечь координаты из ссылки. Проверьте формат ссылки.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          lat: coords.lat,
          lng: coords.lng,
          description: formData.description.trim() || 'Описание скоро появится',
          size: formData.size.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось добавить сугроб');
      }

      // Reset form
      setFormData({
        title: '',
        mapLink: '',
        description: '',
        size: '',
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="frosted-glass rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-winter-text">Добавить новый сугроб</h2>
          <button
            onClick={onClose}
            className="text-winter-text/60 hover:text-winter-text transition-colors text-2xl leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-winter-text mb-2">
              Название сугроба *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-xl
                bg-snow-white/50 border border-glass-border
                text-winter-text placeholder-winter-text/40
                focus:outline-none focus:ring-2 focus:ring-accent-warm/50
                transition-all
              "
              placeholder="Например: Сугроб №4"
              required
            />
          </div>

          <div>
            <label htmlFor="mapLink" className="block text-sm font-medium text-winter-text mb-2">
              Ссылка с карт *
            </label>
            <input
              type="text"
              id="mapLink"
              name="mapLink"
              value={formData.mapLink}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-xl
                bg-snow-white/50 border border-glass-border
                text-winter-text placeholder-winter-text/40
                focus:outline-none focus:ring-2 focus:ring-accent-warm/50
                transition-all
              "
              placeholder="Вставьте ссылку из Яндекс или Google карт"
              required
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-winter-text mb-2">
              Размер *
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              maxLength={20}
              className="
                w-full px-4 py-3 rounded-xl
                bg-snow-white/50 border border-glass-border
                text-winter-text placeholder-winter-text/40
                focus:outline-none focus:ring-2 focus:ring-accent-warm/50
                transition-all
              "
              placeholder="Например: 100 (м²) или огромный"
              required
            />
            <p className="mt-1 text-xs text-winter-text/60">
              Максимум 20 символов
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-winter-text mb-2">
              Описание (опционально)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="
                w-full px-4 py-3 rounded-xl
                bg-snow-white/50 border border-glass-border
                text-winter-text placeholder-winter-text/40
                focus:outline-none focus:ring-2 focus:ring-accent-warm/50
                transition-all resize-none
              "
              placeholder="Расскажите о месте..."
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 py-3 px-5 rounded-full
                bg-snow-white/30 border border-glass-border
                text-winter-text font-medium
                hover:bg-snow-white/50 transition-all
              "
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1 py-3 px-5 rounded-full
                bg-accent-warm text-white font-medium
                hover:bg-accent-warm/90 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? 'Добавление...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
