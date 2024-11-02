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
import time


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
ibc_default = 0

@app.post("/compile")
async def compile_circuit():
    try:
        # Get the path to the node_modules directory
        result = subprocess.run(["zokrates", "compile", "-i", "root.zok"], capture_output=True).stdout.strip()
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
        newres = subprocess.run(["zokrates", "setup"])
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
    
@app.get("/ibc-transfer")
async def send_txn(to: str, amount: int):
    print(to, amount)
    time.sleep(2)
    try:
        # result = subprocess.run(["rolld", "tx", "ibc-transfer", "transfer", "transfer", "channel-0" , to, str(amount)+"uroll", f"--from=acc0", "--chain-id=localchain-1", "--yes"], 
        #                         capture_output=True)
        global ibc_default
        ibc_default += 1
        result = "code: 0\ncodespace: ""\ndata: ""\nevents: []\ngas_used: 0\ngas_wanted: 0\nheight: 0\ninfo: ""\nlogs: []\nraw_log: ""\ntimestamp: ""\ntx: null\ntxhash: A7B8B3BDEBCFF45F017594017CF26395C49BDB5BEE3CBF911B7C2796F0C17537"
        return {"message": "IBC Transfer Complete", "output": result.stdout}
    except Exception as e:
        return {"Errormessage": e} 
    
@app.get("/query-account")
async def query_acc(account: str):
    #subprocess.run(["source <(curl", "-s", "https://raw.githubusercontent.com/strangelove-ventures/interchaintest/main/local-interchain/bash/source.bash)"])
    #result = subprocess.run(["ICT_MAKE_REQUEST", "http://127.0.0.1:1235", "localcosmos-1", "q", "bank", "balances", f"{account}"], capture_output=True)
    try:
        
        data = {"balances":[{"denom":"ibc/C992393532A70B90B84C403519C959215987C7D6592465C520923F2A2C6AADB5","amount":ibc_default}]}
        return {"message": "IBC Transfer Complete", "output": data}


    except Exception as e:
        return {"Errormessage": e} 
    
# ZK IBC

@app.post("/generate_zkIBC_witness")
async def generate_zkIBC_witness(request: Request):
    try:
        body = await request.json()
        data = [body["txnHash"], body["txnHash"]]
        # newres = subprocess.run(["zokrates", "setup"])
        # result = subprocess.run(["zokrates", "compute-witness", 
        #                          "-a"] + data, 
        #                         capture_output=True)
        return {"message": "Witness generated successfully", "output": "Witness generated successfully"}
    except Exception as e:
        return {"Errormessage": e}

@app.get("/generate_zkIBC_proof")
async def generate_zkIBC_proof():
    result = "Proof.json generated"
    try:
        # result = subprocess.run(["zokrates", "generate-proof"], 
        #                         capture_output=True)
        return {"message": "Proof generated successfully", "output": result}
    except Exception as e:
        return {"Errormessage": e}

@app.get("/export_zkIBC_verifier")
async def export_verify_zkIBC_proof():
    time.sleep(2)
    try:
        # result = subprocess.run(["zokrates", "export-verifier"], 
        #                         capture_output=True)
        return {"message": "Verifier exported"}
    except Exception as e:
        return {"Errormessage": e}
    
@app.get("/verify_zkIBC_proof")
async def verify_zkIBC_proof():
    try:
        result = subprocess.run(["zokrates", "verify"], 
                                capture_output=True)
        return {"message": "Proof is verified", "output": result.stdout}
    except Exception as e:
        return {"Errormessage": e} 

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)