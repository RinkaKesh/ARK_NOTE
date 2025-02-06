
const NOTE_STATUS = {
    TODO: 'todo',
    ACTIVE: 'active',
    OVERDUE: 'overdue',
    COMPLETED: 'completed'
  };
  
  const STATUS_PRIORITIES = {
    [NOTE_STATUS.COMPLETED]: 0,
    [NOTE_STATUS.ACTIVE]: 1,
    [NOTE_STATUS.TODO]: 2,
    [NOTE_STATUS.OVERDUE]: 3
  };
// export class NoteStatusService {
//     static calculateStatus(startDate, endDate) {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
      
//       const end = new Date(endDate);
//       end.setHours(0, 0, 0, 0);
  
//       // Same logic as backend but available for frontend validation
//       if (start.getTime() === end.getTime()) {
//         if (start < today) return NOTE_STATUS.OVERDUE;
//         if (start.getTime() === today.getTime()) return NOTE_STATUS.ACTIVE;
//         return NOTE_STATUS.TODO;
//       }
  
//       if (start > today) return NOTE_STATUS.TODO;
//       if (end < today) return NOTE_STATUS.OVERDUE;
//       return NOTE_STATUS.ACTIVE;
//     }
  
//     static validateDateRange(startDate, endDate) {
//       return new Date(startDate) <= new Date(endDate);
//     }
//   }

 export class NoteStatusService {
    static calculateStatus(startDate, endDate, currentStatus = null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
  
      // Special handling for previously completed notes
      if (currentStatus === NOTE_STATUS.COMPLETED) {
        // When a completed note is edited, it gets reactivated
        // Status is recalculated based on new dates
        if (start.getTime() === end.getTime()) {
          if (start < today) return NOTE_STATUS.OVERDUE;
          if (start.getTime() === today.getTime()) return NOTE_STATUS.ACTIVE;
          return NOTE_STATUS.TODO;
        }
  
        if (start > today) return NOTE_STATUS.TODO;
        if (end < today) return NOTE_STATUS.OVERDUE;
        return NOTE_STATUS.ACTIVE;
      }
  
      // Original status calculation logic
      if (start.getTime() === end.getTime()) {
        if (start < today) return NOTE_STATUS.OVERDUE;
        if (start.getTime() === today.getTime()) return NOTE_STATUS.ACTIVE;
        return NOTE_STATUS.TODO;
      }
  
      if (start > today) return NOTE_STATUS.TODO;
      if (end < today) return NOTE_STATUS.OVERDUE;
      return NOTE_STATUS.ACTIVE;
    }
  
    // Existing method
    static validateDateRange(startDate, endDate) {
      return new Date(startDate) <= new Date(endDate);
    }
  }