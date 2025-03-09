export default function calculateDetailedAge(birthDate: string) {
  const today = new Date(); // Tanggal saat ini
  const birth = new Date(birthDate); // Mengonversi tanggal lahir ke objek Date

  let years = today.getFullYear() - birth.getFullYear(); // Menghitung selisih tahun
  let months = today.getMonth() - birth.getMonth(); // Menghitung selisih bulan
  let days = today.getDate() - birth.getDate(); // Menghitung selisih hari

  // Jika hari saat ini kurang dari hari lahir, kurangi satu bulan dan tambahkan hari dari bulan sebelumnya
  if (days < 0) {
    months--; // Kurangi satu bulan
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Mendapatkan jumlah hari di bulan sebelumnya
    days += lastMonth.getDate(); // Tambahkan jumlah hari bulan sebelumnya
  }

  // Jika bulan saat ini kurang dari bulan lahir, kurangi satu tahun dan tambahkan 12 bulan
  if (months < 0) {
    years--; // Kurangi satu tahun
    months += 12; // Tambahkan 12 bulan
  }

  return `${years} tahun ${months} bulan ${days} hari`; // Mengembalikan umur dalam format yang diinginkan
}

// Calculate age from date at format {age: number, months: number}
export function calculateAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    age--;
    months += 12;
  }

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  return { age, months };
}
