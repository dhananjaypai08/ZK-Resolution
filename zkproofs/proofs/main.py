from fastapi import FastAPI, HTTPException, Request
import subprocess
import json
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
# DNS and ENS imports 
import dns.message
import dns.query
import dns.resolver
import dns


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

@app.post("/generate_witness")
async def generate_witness(request: Request):
    try:
        body = await request.json()
        
        set_distance, usr_latitude, usr_longitude, domain_lat, domain_long = int(body["set_distance"]), float(body["usr_latitude"]), float(body["usr_longitude"]), float(body["domain_lat"]), float(body["domain_long"])
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
    
@app.get("/forwardToResolver")
def forward_to_dns_resolver(domain: str, address_resolver: str, resolver_port=53):
    # Create a new DNS query message in traditional way
    print(domain, address_resolver)
    if not address_resolver or address_resolver=="null" or len(address_resolver.split("."))<4:
        address_resolver = "8.8.8.8" #default
    query = dns.message.make_query(domain, dns.rdatatype.A)

    try:
        # Send the query to the DNS resolver
        response = dns.query.udp(query, address_resolver, port=resolver_port, timeout=5)

        # Check if we got a valid response
        if response.rcode() == dns.rcode.NOERROR:
            # Extract the IP addresses from the answer section
            ip_addresses = []
            for answer in response.answer:
                for item in answer.items:
                    if item.rdtype == dns.rdatatype.A:
                        ip_addresses.append(item.address)
            
            return ip_addresses
        else:
            return f"DNS query failed with response code: {dns.rcode.to_text(response.rcode())}"
    except dns.exception.Timeout:
        return "DNS query timed out"
    except Exception as e:
        return f"An error occurred: {str(e)}"

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)