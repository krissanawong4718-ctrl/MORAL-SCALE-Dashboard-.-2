import { SchoolData } from './types';

export const MOCK_DATA: SchoolData[] = [
  // Network 1
  {
    id: '1',
    date: '2026-03-15',
    network: 'ศูนย์เครือข่ายที่ 1',
    schoolName: 'โรงเรียนอนุบาลสว่างแดนดิน',
    coordinates: { lat: 17.4756, lng: 103.4567 },
    totalStudents: 500,
    lateStudents: 25,
    onTimeStudents: 475,
    workSubmission: 450,
    returnedItems: 15,
    otherGoodDeeds: 30,
  },
  {
    id: '2',
    date: '2026-03-15',
    network: 'ศูนย์เครือข่ายที่ 1',
    schoolName: 'โรงเรียนบ้านหนองบัว',
    coordinates: { lat: 17.4800, lng: 103.4600 },
    totalStudents: 200,
    lateStudents: 10,
    onTimeStudents: 190,
    workSubmission: 180,
    returnedItems: 5,
    otherGoodDeeds: 12,
  },
  // Network 2
  {
    id: '3',
    date: '2026-03-15',
    network: 'ศูนย์เครือข่ายที่ 2',
    schoolName: 'โรงเรียนบ้านดอนเขือง',
    coordinates: { lat: 17.4200, lng: 103.5500 },
    totalStudents: 350,
    lateStudents: 15,
    onTimeStudents: 335,
    workSubmission: 310,
    returnedItems: 8,
    otherGoodDeeds: 20,
  },
  // Network 3
  {
    id: '4',
    date: '2026-03-15',
    network: 'ศูนย์เครือข่ายที่ 3',
    schoolName: 'โรงเรียนบ้านพันนา',
    coordinates: { lat: 17.3500, lng: 103.6000 },
    totalStudents: 420,
    lateStudents: 30,
    onTimeStudents: 390,
    workSubmission: 370,
    returnedItems: 10,
    otherGoodDeeds: 25,
  },
  // Historical data for trend
  {
    id: 'hist-1',
    date: '2026-02-15',
    network: 'ศูนย์เครือข่ายที่ 1',
    schoolName: 'โรงเรียนอนุบาลสว่างแดนดิน',
    coordinates: { lat: 17.4756, lng: 103.4567 },
    totalStudents: 500,
    lateStudents: 35,
    onTimeStudents: 465,
    workSubmission: 440,
    returnedItems: 12,
    otherGoodDeeds: 25,
  },
  // Generate entries for other networks to show scale
  ...Array.from({ length: 17 }, (_, i) => ({
    id: `net-${i + 4}`,
    date: '2026-03-15',
    network: `ศูนย์เครือข่ายที่ ${i + 4}`,
    schoolName: `โรงเรียนตัวอย่างเครือข่ายที่ ${i + 4}`,
    coordinates: { 
      lat: 17.1 + (Math.random() * 0.5), 
      lng: 103.2 + (Math.random() * 0.6) 
    },
    totalStudents: 150 + Math.floor(Math.random() * 200),
    lateStudents: 5 + Math.floor(Math.random() * 20),
    onTimeStudents: 140 + Math.floor(Math.random() * 180),
    workSubmission: 130 + Math.floor(Math.random() * 170),
    returnedItems: 2 + Math.floor(Math.random() * 10),
    otherGoodDeeds: 5 + Math.floor(Math.random() * 15),
  }))
];
