

export function reorderList<T>(originalList: T[], newIndices: number[]) {
  // Check for valid input
  if (originalList.length !== newIndices.length) {
    throw new Error('The original list and the new indices array must have the same length.');
  }
  const reorderedList: T[] = new Array(originalList.length);

  for (let i = 0; i < newIndices.length; i++) {
    const newIndex = newIndices[i];
    const originalElement = originalList[newIndex];

    reorderedList[i] = originalElement;
  }

  return reorderedList;
}
