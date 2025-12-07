from IPython.display import clear_output
!pip install pyngrok fastapi pillow google-genai uvicorn 
clear_output()
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pyngrok import ngrok, conf
import google.generativeai as genai
from PIL import Image
import io
import os
import threading
import uvicorn
import nest_asyncio

# === FIX AGAR UVICORN TIDAK ERROR DI JUPYTER / COLAB ===
nest_asyncio.apply()

# ===========================
# NGROK AUTH TOKEN
# ===========================
NGROK_AUTH_TOKEN = ""
conf.get_default().auth_token = NGROK_AUTH_TOKEN

# ===========================
# KONFIG GEMINI
# ===========================
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

# ===========================
# FASTAPI APP
# ===========================
app = FastAPI()

# ===========================
# CORS
# ===========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# SCHEMA
# ===========================
class ChatRequest(BaseModel):
    message: str

class HPPRequest(BaseModel):
    user_input: str

# ===========================
# ENDPOINT OCR
# ===========================
@app.post("/ocr")
async def ocr_struk_endpoint(file: UploadFile = File(...)):
    if file.content_type.split("/")[0] != "image":
        raise HTTPException(status_code=400, detail="Hanya menerima file gambar")

    contents = await file.read()
    img = Image.open(io.BytesIO(contents))

    prompt = """
    Kamu adalah AI OCR yang sangat akurat.
    Baca isi struk pada gambar dan kembalikan hasil dalam FORMAT LIST SEDERHANA seperti berikut:

    "toko":
    "tanggal":
    "items":
    "nama":
    "jumlah":
    "harga_satuan":
    "total":
    "total_bayar":

    Aturan:
    - Jangan gunakan JSON atau {} atau [].
    - Hanya isi nilai setelah tanda titik dua.
    - Jika ada beberapa item, tuliskan semuanya dalam bagian "items" dengan baris baru.
    - Jika jumlah tidak ada di struk, isi jumlah = 1.
    - Gunakan angka tanpa koma atau simbol (contoh: 14000).
    - Bersihkan nama item agar mudah dibaca.
    - Jangan menambahkan kalimat penjelas di luar format list tersebut.
    """

    response = model.generate_content([prompt, img])
    return {"result": response.text.strip()}

# ===========================
# ENDPOINT CHATBOT
# ===========================
@app.post("/chatbot")
async def chatbot_endpoint(req: ChatRequest):
    response = model.generate_content([req.message])
    return {"reply": response.text.strip()}

# ===========================
# ENDPOINT HPP
# ===========================
@app.post("/hpp")
async def hpp_endpoint(req: HPPRequest):
    prompt = """
    Kamu adalah AI HPP Calculator untuk UMKM. Tugasmu adalah menghitung HPP (Harga Pokok Produksi)
    dan memberikan rekomendasi harga jual berdasarkan margin 25% sampai 50%.

    Input yang diberikan user selalu memiliki format:

    nama produk = ...

    bahan:
    - nama bahan = ...
    - satuan = ...
    - harga beli = ...

    biaya operasional:
    biaya tenaga kerja per hari atau per bulan = ...
    biaya overhead per hari atau per bulan = ...

    jumlah produk atau unit = ...

    deskripsi tambahan = ...

    Tugasmu:
    1. Hitung total biaya bahan (jumlahkan semua harga beli).
    2. Hitung biaya operasional per unit:
       operasional_per_unit = (tenaga_kerja + overhead) / jumlah_unit
    3. Hitung HPP per unit:
       hpp = (total_bahan / jumlah_unit) + operasional_per_unit
    4. Berikan rekomendasi harga jual dengan margin:
       • 25%
       • 30%
       • 40%
       • 50%
    5. Tampilkan hasil secara jelas, rapi, dan mudah dibaca.
    6. Jika deskripsi user menyebut target laba, variasi rasa, lokasi, atau situasi bisnis tertentu,
       sesuaikan saran harga.

    Output yang harus kamu berikan:

    HPP Summary:
    - Total biaya bahan:
    - Biaya operasional per unit:
    - HPP per unit:

    Rekomendasi Harga Jual:
    - Margin 25%:
    - Margin 30%:
    - Margin 40%:
    - Margin 50%:

    Catatan tambahan (opsional):
    • Saran singkat mengenai harga jual & strategi bisnis.
    """
    response = model.generate_content([prompt, req.user_input])
    return {"result": response.text.strip()}

# ===========================
# NGROK TANPA ASYNC
# ===========================
def start_ngrok():
    public_url = ngrok.connect(8000)
    print("🚀 NGROK URL:", public_url)

# ===========================
# MAIN
# ===========================
if _name_ == "_main_":
    threading.Thread(target=start_ngrok, daemon=True).start()
    uvicorn.run(app, host="0.0.0.0", port=8000)