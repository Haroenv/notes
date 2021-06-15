export type Note = {
  title: string;
  content: string;
  links: string[];
};

export const createNote = ({
  title = '',
  content = '',
  links = [],
}: Partial<Note>): Note => ({ title, content, links });
