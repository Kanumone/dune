'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Location } from '@/app/lib/types';

export default function AdminPanel() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; locationId: number | null; locationTitle: string }>({
    isOpen: false,
    locationId: null,
    locationTitle: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations');

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        setError('Не удалось загрузить локации');
      }
    } catch (err) {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleToggleVisibility = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canShow: !currentStatus }),
      });

      if (response.ok) {
        await fetchLocations();
      } else {
        setError('Не удалось обновить локацию');
      }
    } catch (err) {
      setError('Ошибка сети');
    }
  };

  const handleDelete = (id: number, title: string) => {
    setDeleteModal({
      isOpen: true,
      locationId: id,
      locationTitle: title,
    });
  };

  const confirmDelete = async () => {
    if (deleteModal.locationId === null) return;

    try {
      const response = await fetch(`/api/locations/${deleteModal.locationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchLocations();
        setDeleteModal({ isOpen: false, locationId: null, locationTitle: '' });
      } else {
        setError('Не удалось удалить локацию');
      }
    } catch (err) {
      setError('Ошибка сети');
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, locationId: null, locationTitle: '' });
  };

  const handleRowClick = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getPopularityText = (popularity: string) => {
    switch (popularity) {
      case 'small': return 'Малая';
      case 'medium': return 'Средняя';
      case 'large': return 'Большая';
      default: return popularity;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="w-12 h-12 border-4 border-accent-warm/20 border-t-accent-warm rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <header className="bg-white shadow-sm border-b border-neutral-medium">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-dark">
            Панель администратора
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-neutral-dark text-white rounded-md hover:bg-neutral-dark/90"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-medium">
            <h2 className="text-xl font-semibold text-neutral-dark">
              Все локации ({locations.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-medium">
                {locations.map((location) => {
                  const isExpanded = expandedRows.has(location.id);
                  return (
                    <Fragment key={location.id}>
                      <tr
                        onClick={() => handleRowClick(location.id)}
                        className="hover:bg-neutral-light/50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-dark">
                          {location.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              location.canShow
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {location.canShow ? 'Видна' : 'Скрыта'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVisibility(location.id, location.canShow);
                            }}
                            className={`px-3 py-1 rounded ${
                              location.canShow
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {location.canShow ? 'Скрыть' : 'Показать'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(location.id, location.title);
                            }}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${location.id}-details`} className="bg-neutral-light/30">
                          <td colSpan={3} className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-neutral-dark">ID:</span>{' '}
                                <span className="text-neutral-dark">{location.id}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-neutral-dark">Координаты:</span>{' '}
                                <span className="text-neutral-dark">
                                  {location.coords[0].toFixed(4)}, {location.coords[1].toFixed(4)}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="font-semibold text-neutral-dark">Описание:</span>{' '}
                                <span className="text-neutral-dark">{location.description}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-neutral-dark">Категории:</span>{' '}
                                <span className="text-neutral-dark">
                                  {location.categories.length > 0 ? location.categories.join(', ') : 'Нет'}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-neutral-dark">Бейджи:</span>{' '}
                                <span className="text-neutral-dark">
                                  {location.badges.length > 0 ? location.badges.join(', ') : 'Нет'}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-neutral-dark">Популярность:</span>{' '}
                                <span className="text-neutral-dark">{getPopularityText(location.popularity)}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-neutral-dark">Клики:</span>{' '}
                                <span className="text-neutral-dark">{location.clicks}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {locations.length === 0 && !loading && (
            <div className="px-6 py-12 text-center text-neutral-dark">
              Локации не найдены.
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={cancelDelete}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-neutral-dark mb-4">
              Подтверждение удаления
            </h3>
            <p className="text-neutral-dark mb-6">
              Вы уверены, что хотите удалить локацию <span className="font-semibold">"{deleteModal.locationTitle}"</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-neutral-medium text-neutral-dark rounded-md hover:bg-neutral-medium/80 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
