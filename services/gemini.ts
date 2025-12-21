const WORD_LIMIT = 6;

const buildTitleFromContent = (content: string): string => {
    const normalized = content
        .replace(/\s+/g, ' ')
        .trim();

    if (!normalized) {
        return 'Untitled Entry';
    }

    const words = normalized.split(' ').slice(0, WORD_LIMIT);
    return words.join(' ');
};

const generateTitle = async (content: string, providedTitle?: string): Promise<string> => {
    const manualTitle = providedTitle?.trim();

    if (manualTitle) {
        return manualTitle;
    }

    return buildTitleFromContent(content);
};

export { generateTitle, buildTitleFromContent };