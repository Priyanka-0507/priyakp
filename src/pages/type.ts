export interface Word {
    word: string;
    meaning: string;
    example: string;
    image: string;
  }
  export interface UserDetails {
    name: string;
    email: string;
    phoneNumber: string;
    acceptedTerms: boolean;
  }
  export interface Store {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    medicines: Medicine[];
    rating?: number;
    phone?: string;
    isOpen?: boolean;
  }
  
  export interface Medicine {
    name: string;
    availability: boolean;
    price: number;
  }