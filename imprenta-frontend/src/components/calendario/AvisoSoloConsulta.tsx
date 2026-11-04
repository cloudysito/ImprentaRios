import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterState } from '../../types/calendario';

interface CalendarControlsProps {
  view: 'dia' | 'semana';
  onViewChange: (view: 'dia' | 'semana') => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  dateRangeText?: string;
}

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  view,
  onViewChange,
  filters,
  onFilterChange,
  dateRangeText = '21 al 26 sep 2026',
}) => {
  return (
    <div className="space-y-4">
      {/* Botones Día/Semana y Selector de Fecha */}
      <div className="flex items-center justify-between">
        <div className="flex bg-stone-200/60 p-1 rounded-lg">
          <button
            onClick={() => onViewChange('dia')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              view === 'dia' ? 'bg-white shadow-sm text-black' : 'text-stone-600'
            }`}
          >
            Día
          </button>
          <button
            onClick={() => onViewChange('semana')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              view === 'semana' ? 'bg-[#1E1C1A] text-white shadow-sm' : 'text-stone-600'
            }`}
          >
            Semana
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-1.5 shadow-sm text-sm font-medium text-stone-700">
          <button className="hover:text-black"><ChevronLeft size={16} /></button>
          <span>{dateRangeText}</span>
          <button className="hover:text-black"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Checkboxes de Filtros */}
      <div className="flex items-center gap-6 text-sm font-medium text-stone-700">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Mostrar</span>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.produccion}
            onChange={(e) => onFilterChange({ ...filters, produccion: e.target.checked })}
            className="rounded border-stone-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="w-3 h-3 rounded-sm bg-[#ECE6F8]"></span>
          <span>Producción</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.entregas}
            onChange={(e) => onFilterChange({ ...filters, entregas: e.target.checked })}
            className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="w-3 h-3 rounded-sm bg-[#E3F4EB]"></span>
          <span>Entregas</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.mantenimiento}
            onChange={(e) => onFilterChange({ ...filters, mantenimiento: e.target.checked })}
            className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <span className="w-3 h-3 rounded-sm bg-[#F9EED9]"></span>
          <span>Mantenimiento</span>
        </label>
      </div>
    </div>
  );
};