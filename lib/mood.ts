export type MoodValue =
    | 'joyful'
    | 'grateful'
    | 'calm'
    | 'neutral'
    | 'tired'
    | 'stressed'
    | 'sad'
    | 'excited';

export interface MoodOption {
    value: MoodValue;
    label: string;
    emoji: string;
    accent: string;
    badge: string;
    description: string;
    heatmap: string;
}

export const DEFAULT_MOOD: MoodValue = 'neutral';

export const MOOD_OPTIONS: MoodOption[] = [
    { value: 'joyful', label: 'Joyful', emoji: '😊', accent: 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-200/10 dark:text-amber-200', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-200/20 dark:text-amber-100', description: 'Optimistic and light', heatmap: '255, 193, 7' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏', accent: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-200/10 dark:text-emerald-200', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-200/20 dark:text-emerald-100', description: 'Grounded and appreciative', heatmap: '16, 185, 129' },
    { value: 'calm', label: 'Calm', emoji: '🌿', accent: 'border-teal-300 bg-teal-50 text-teal-700 dark:bg-teal-200/10 dark:text-teal-200', badge: 'bg-teal-100 text-teal-800 dark:bg-teal-200/20 dark:text-teal-100', description: 'Peaceful mindset', heatmap: '45, 212, 191' },
    { value: 'neutral', label: 'Neutral', emoji: '😌', accent: 'border-gray-300 bg-gray-50 text-gray-700 dark:bg-gray-200/10 dark:text-gray-200', badge: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200', description: 'Even and steady', heatmap: '156, 163, 175' },
    { value: 'tired', label: 'Tired', emoji: '🥱', accent: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-200/10 dark:text-indigo-200', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-200/20 dark:text-indigo-100', description: 'Low energy', heatmap: '99, 102, 241' },
    { value: 'stressed', label: 'Stressed', emoji: '⚡', accent: 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-200/10 dark:text-rose-200', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-200/20 dark:text-rose-100', description: 'Under pressure', heatmap: '244, 63, 94' },
    { value: 'sad', label: 'Low', emoji: '🌧️', accent: 'border-slate-300 bg-slate-50 text-slate-700 dark:bg-slate-200/10 dark:text-slate-200', badge: 'bg-slate-200 text-slate-800 dark:bg-slate-200/20 dark:text-slate-100', description: 'Carrying heavy feelings', heatmap: '71, 85, 105' },
    { value: 'excited', label: 'Excited', emoji: '🚀', accent: 'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-200/10 dark:text-orange-200', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-200/20 dark:text-orange-100', description: 'Energized and eager', heatmap: '249, 115, 22' }
];

export const MOOD_LOOKUP = MOOD_OPTIONS.reduce<Record<MoodValue, MoodOption>>((acc, option) => {
    acc[option.value] = option;
    return acc;
}, {} as Record<MoodValue, MoodOption>);
