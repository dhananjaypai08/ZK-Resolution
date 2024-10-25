from fastapi import FastAPI, HTTPException, Request
import subprocess
import json
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/compile")
async def compile_circuit():
    try:
        # Get the path to the node_modules directory
        result = subprocess.run(["zokrates", "compile", "-i", "root.zok"], capture_output=True).stdout.strip()
        newres = subprocess.run(["zokrates", "setup"])
        return {"message": "Circuit compiled successfully and setup done", "output": result.stdout}
    except subprocess.CalledProcessError as e:
        return {"Errormessage": e}

@app.get("/generate_witness")
async def generate_witness(set_distance, usr_latitude, usr_longitude, domain_lat, domain_long):
    try:
        user_distance = ((usr_latitude-domain_lat)**2 + (usr_longitude-domain_long)**2)**(1/2)
        [set_distance, int(user_distance)]
        data = [set_distance, int(user_distance)]
        result = subprocess.run(["zokrates", "compute-witness", 
                                 "-a"] + data, 
                                capture_output=True)
        return {"message": "Witness generated successfully", "output": result.stdout}
    except Exception as e:
        return {"Errormessage": e}

@app.get("/generate_proof")
async def generate_proof():
    try:
        result = subprocess.run(["zokrates", "generate-proof"], 
                                capture_output=True)
        return {"message": "Proof generated successfully", "output": result.stdout}
    except Exception as e:
        return {"Errormessage": e}

@app.get("/export_verifier")
async def export_verify_proof():
    try:
        result = subprocess.run(["zokrates", "export-verifier"], 
                                capture_output=True)
        return {"message": "Verifier exported"}
    except Exception as e:
        return {"Errormessage": e}
    
@app.get("/verify_proof")
async def verify_proof():
    try:
        result = subprocess.run(["zokrates", "verify"], 
                                capture_output=True)
        return {"message": "Proof is verified", "output": result.stdout}
    except Exception as e:
        return {"Errormessage": e}

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)