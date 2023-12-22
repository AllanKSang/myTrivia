const API_URL = 'http://localhost:3001/proxy/api.php?amount=10';

export async function fetchTriviaQuestions() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch trivia questions');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

