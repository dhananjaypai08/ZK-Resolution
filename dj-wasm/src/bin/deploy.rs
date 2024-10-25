use cw_orch::{anyhow, prelude::*};
use dj_wasm::{
    interface::DjWasmI,
    msg::{ExecuteMsgFns, InstantiateMsg, QueryMsgFns},
};

pub fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok(); // Used to load the `.env` file if any
    env_logger::init(); // Used to log contract and chain interactions

    let network = networks::PION_1;
    let chain = DaemonBuilder::new(network.clone()).build()?;

    let counter = DjWasmI::new(chain);

    counter.upload()?;

    let msg = InstantiateMsg {};
    counter.instantiate(&msg, None, &[])?;
    Ok(())
}
