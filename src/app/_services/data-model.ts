export interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  // Dựa vào đây để hiển thị nút hành động phù hợp
  status: 'Checked Out' | 'Locate' | 'Borrow';
}

// Dữ liệu mẫu (mock data)
export const TRENDING_BOOKS: Book[] = [
  {
    id: 1,
    title: 'Strategic Management',
    author: 'Fred R. David',
    imageUrl: 'assets/book1.jpg',
    status: 'Checked Out'
  },
  {
    id: 2,
    title: 'Intelligent Memory Systems',
    author: 'Fedrick T. Chong',
    imageUrl: 'assets/book2.jpg',
    status: 'Locate'
  },
  {
    id: 3,
    title: 'Probabilidad y Estadística',
    author: 'Alicia Pérez-Rivas',
    imageUrl: 'assets/book3.jpg',
    status: 'Locate'
  },
  {
    id: 4,
    title: 'Database Systems for Advanced Applications',
    author: 'Various Authors',
    imageUrl: 'assets/book4.jpg',
    status: 'Locate'
  },
  {
    id: 5,
    title: 'AUTHOR\'S NOTE',
    author: 'Unknown',
    imageUrl: 'assets/book5.jpg',
    status: 'Borrow'
  },
  {
    id: 6,
    title: 'THE HOT ROCK',
    author: 'Donald E. Westlake',
    imageUrl: 'assets/book6.jpg',
    status: 'Borrow'
  }
];
