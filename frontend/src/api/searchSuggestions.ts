// src/api/searchSuggestions.ts

/**
 * Внешний вид ответа от сервера:
 * {
 *   [university: string]: {
 *     [faculty: string]: string[]   // список предметов
 *   }
 * }
 */
export interface SuggestionsResponse {
    [university: string]: {
      [faculty: string]: string[];
    };
  }
  
  /**
   * Заглушка: возвращает nested-структуру
   */
  export async function fetchSearchSuggestions(): Promise<SuggestionsResponse> {
    // эмуляция задержки
    await new Promise((res) => setTimeout(res, 200));
  
    return {
      'Universität Wien': {
        Informatik: ['Datenbanken', 'Algorithmen und Datenstrukturen', 'Logik'],
      },
      'Technische Universität Wien': {
        Architektur: ['Baukonstruktion', 'Städtebau', 'Entwurf'],
        Informatik: ['Programmierparadigmen', 'Formale Методы', 'Rechnerarchitektur'],
      },
      BOKU: {
        Umweltwissenschaften: ['Öкология', 'Nachhaltigkeit', 'Kлимawandel'],
      },
      'FH Technikum Wien': {
        'Software Engineering': ['Webentwicklung', 'Mobile Apps', 'Softwaredesign'],
      },
      'WU Wien': {
        Betriebswirtschaft: ['Rechnungswesen', 'Marketing', 'Finanzierung'],
      },
    };
  }