# Note GS – ভর্তি ফর্ম

## ১. Supabase (একবার)
1. supabase.com > New project
2. SQL Editor > `supabase.sql` ফাইলের সব কোড পেস্ট করে Run
3. Project Settings > API থেকে `Project URL` ও `anon public key` কপি করে `.env` ফাইলে বসান

## ২. কম্পিউটারে চালান
```
cd note-gs
npm install
npm run dev
```
ব্রাউজারে http://localhost:5173 খুলুন।

## ৩. GitHub
```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/note-gs.git
git push -u origin main
```

## ৪. Vercel
1. vercel.com > Add New > Project > GitHub থেকে `note-gs` Import
2. Environment Variables-এ `.env` এর ৩টি লাইন যোগ করুন
3. Deploy চাপুন
4. লিংকটি Facebook পেজে বসান

জমা হওয়া তথ্য: Supabase > Table Editor > admissions
