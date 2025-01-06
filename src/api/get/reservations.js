import axios from 'axios';

export const fetchReservations = async () => {
  try {
    // const response = await axios.get('/test.json');
    return [
      {
        "class" : "A",
        "date" : "2025-01-06",
        "start" : "19:00",
        "end" : "21:30",
        "reserver" : {
          "id" : "1",
          "name" : "John Doe",
          "email" : "John@test.com"
        },
        "description": "CS Study group meeting",
        "participants": [
          {
            "id" : "2",
            "name" : "Jane Smith",
            "email" : "Jane@test.com"
          },
          {
            "id" : "3",
            "name" : "Alice Johnson",
            "email" : "Alice@test.com"
          }
        ]
      },
      {
        "class" : "B",
        "date" : "2025-01-06",
        "start" : "20:00",
        "end" : "21:30",
        "reserver" : {
          "id" : "4",
          "name" : "Bob Brown",
          "email" : "Bob@test.com"
        },
        "description": "Coding Test Study group meeting",
        "participants": [
          {
            "id" : "5",
            "name" : "Tom Green",
            "email" : "Tome@test.com"
          }
        ]
      }
    ]
    ;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
};
