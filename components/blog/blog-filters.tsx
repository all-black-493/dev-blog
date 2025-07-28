import { TagSelector } from './tag-selector'

type Props = {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function BlogFilters({
  selectedTags,
  onTagsChange,
  searchQuery,
  onSearchChange
}: Props) {
  return (
    <TagSelector
      selectedTags={selectedTags}
      onTagsChange={onTagsChange}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
    />
  )
}