import { KeyboardEvent } from 'react';

export type TagsInputProps = {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTagKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
};

export const TagsInput = ({ tags, tagInput, onTagInputChange, onAddTagKeyDown, onRemoveTag }: TagsInputProps) => {
  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags (press Enter to add)
      </label>
      <input
        type="text"
        value={tagInput}
        onChange={(e) => onTagInputChange(e.target.value)}
        onKeyDown={onAddTagKeyDown}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        placeholder="e.g. Furnished, Parking, Balcony"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-amber-400 hover:bg-amber-200 hover:text-amber-500 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
