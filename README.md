Struktur Kode
Kode ini terdiri dari dua kelas utama:

Note: Merepresentasikan sebuah catatan jurnal individual. Setiap catatan memiliki id, title (judul), content (isi), dan timestamp (waktu pembuatan/pembaruan). Kelas ini juga memiliki metode statis fromObject yang berguna untuk merekonstruksi objek Note dari data yang tersimpan di Local Storage.

NoteApp: Ini adalah inti dari aplikasi. Kelas ini mengelola semua logika aplikasi, termasuk:

Penyimpanan Data: Menggunakan Local Storage untuk memuat (loadNotes) dan menyimpan (saveNotes) catatan, sehingga data tetap ada meskipun pengguna menutup peramban.
Operasi CRUD: Menyediakan metode untuk menambah (addNote), memperbarui (updateNote), dan menghapus (deleteNote) catatan.
Manipulasi DOM: Bertanggung jawab untuk menampilkan catatan di halaman web (displayNotes) dan memperbarui tampilan saat ada perubahan.
Penanganan Event: Mengatur event listener untuk formulir penambahan catatan, tombol edit/hapus, dan input filter.
Simulasi Server: Ada fungsi simulateServerSend yang meniru pengiriman data ke server. Ini bagus untuk menunjukkan bagaimana aplikasi bisa berinteraksi dengan backend di masa depan.
Cara Kerja Singkat
Inisialisasi: Saat halaman web dimuat (DOMContentLoaded), objek NoteApp baru dibuat. Ini akan memuat catatan yang sudah ada dari Local Storage dan menyiapkan semua event listener yang diperlukan.
Tambah Catatan: Pengguna mengisi formulir, lalu mengklik "Submit". NoteApp membuat objek Note baru, menambahkannya ke daftar catatan, menyimpannya ke Local Storage, dan memperbarui tampilan.
Edit/Hapus Catatan: Setiap catatan yang ditampilkan memiliki tombol "Edit" dan "Delete". Mengklik tombol ini akan memicu fungsi yang sesuai di NoteApp untuk mengubah atau menghapus catatan, kemudian menyimpan perubahan dan memperbarui tampilan.
Filter Catatan: Pengguna dapat mencari catatan berdasarkan kata kunci di judul atau isi, serta memfilter berdasarkan tanggal, yang akan memperbarui daftar catatan yang ditampilkan.
Penyimpanan Otomatis: Setiap kali ada penambahan, pembaruan, atau penghapusan catatan, data akan otomatis disimpan ke Local Storage agar tidak hilang.
