import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { LinearProgress } from "@mui/material";
import { CircuitId, decodeBase64url, encodeBase64url, processZeroKnowledgeProofRequests, createVerifiablePresentation, W3CCredential } from "@0xpolygonid/js-sdk";
import { getDocumentLoader } from '@iden3/js-jsonld-merklization';
import { DID, toBigEndian } from "@iden3/js-iden3-core";
import { canonize } from 'jsonld';
import { hash } from '@iden3/js-jwz';

const useQuery = (key) => {
  const { search } = useLocation();
  return React.useMemo(
    () => new URLSearchParams(search).get(key),
    [search, key]
  );
};

const adaptZKPProofReq = (pd) => {
  const inputDescriptor = pd.input_descriptors[0];
  const iden3zkpReq = inputDescriptor.format.iden3_zkp_request;
  const zkpRequest = {
    id: inputDescriptor.id,
    circuitId: iden3zkpReq.circuitId,
    optional: iden3zkpReq.optional,
    query: {
      ...iden3zkpReq.query,
    },
  };
  return zkpRequest;
};

const adaptIden3AuthResponseToOIDC = async (
  presentationDefinition,
  from,
  proofService,
  prover,
  requests,
  responses,
) => {
  const scope = responses ? responses[0] : undefined;
  let vp = scope?.vp;
  if (!vp) {
    if (!responses?.length) {
      vp = createVerifiablePresentation(
        '',
        '',
        new W3CCredential(),
        []
      );
    } else {
      const query = requests[0].query;
      const context = query['context'];
      const credentialType = query['type'];
      vp = createVerifiablePresentation(
        context,
        credentialType,
        new W3CCredential(),
        []
      );
    }
  }

  vp.holder = from.string();
  // add zkp proofs to vp/vc
  const zkpCredProof = {
    id: `urn:requestId:${presentationDefinition.input_descriptors[0].id}`,
    circuit_id: scope?.circuitId,
    pi_a: scope?.proof.pi_a,
    pi_b: scope?.proof.pi_b,
    pi_c: scope?.proof.pi_c,
    protocol: scope?.proof.protocol,
    curve: scope?.proof.curve,
    pub_signals: scope?.pub_signals,
    type: 'Iden3ZeroKnowledgeProof',
  };

  const zkProofContext =
    'https://raw.githubusercontent.com/iden3/claim-schema-vocab/cbf810ea5620054be44efeb29e5bd41e030f7815/core/jsonld/Iden3ZeroKnowledgeProof.jsonld';
 
  vp['verifiableCredential']['proof'] = zkpCredProof;
  vp['@context'] = [...vp['@context'], zkProofContext];
  vp['verifiableCredential']['@context'] = [
    ...vp['verifiableCredential']['@context'],
    zkProofContext,
  ];
   // for auth req:
   if (!scope) {
    delete vp.verifiableCredential;
  }
  
  console.log(JSON.stringify(vp));
  const documentLoader = getDocumentLoader();
  const canonizedRes = await canonize(vp, {documentLoader});
  const encoded = new TextEncoder().encode(canonizedRes);
  const hashed = hash(encoded);
  const hashBE = toBigEndian(hashed, 32);

  const authInputs = await proofService.generateAuthV2Inputs(hashBE, from, CircuitId.AuthV2);
  const authProof = await prover.generate(authInputs, CircuitId.AuthV2);
  const authZkpProof = {
    circuit_id: CircuitId.AuthV2,
    pi_a: authProof.proof.pi_a,
    pi_b: authProof.proof.pi_b,
    pi_c: authProof.proof.pi_c,
    protocol: authProof.proof.protocol,
    curve: 'bn128',
    pub_signals: authProof.pub_signals,
    type: 'Iden3ZeroKnowledgeProof',
  };
  vp['proof'] = authZkpProof;
  console.log(JSON.stringify(vp));

  const presentationSubmission = {
    id: 'Presentation submission example',
    definition_id: presentationDefinition.id,
    descriptor_map: [
      {
        id: presentationDefinition.input_descriptors[0].id.toString(),
        format: 'iden3_zkp_request',
        path: '$',
        path_nested: {
          format: 'ldp_vc',
          path: '$.verifiableCredential',
        },
      },
    ],
  };

  // for auth req:
  if (!scope) {
    delete presentationSubmission.descriptor_map[0].path_nested;
  }
  const openIdResponse = {
    vp_token: encodeBase64url(JSON.stringify(vp)),
    presentation_submission: encodeBase64url(
      JSON.stringify(presentationSubmission)
    ),
  };

  return openIdResponse;
};

const generateResponse = async (
  req,
  userDID
) => {
  debugger
  const { proofService, nativeProver } = ExtensionService.getExtensionServiceInstance();
  const pd = JSON.parse(decodeBase64url(req.presentation_definition));
  console.log('presentation_definition', pd);
  const issuer = DID.parse(req.client_id);
  const user = DID.parse(userDID);
  const zkpReq = adaptZKPProofReq(pd);

  const zkpRequests = zkpReq.circuitId ? [zkpReq] : []
  const responseScope = await processZeroKnowledgeProofRequests(user, zkpRequests, issuer, proofService, {
    supportedCircuits: [CircuitId.AtomicQueryV3, CircuitId.AuthV2]
  });

  const adaptOidcResp = adaptIden3AuthResponseToOIDC(
    pd,
    user,
    proofService,
    nativeProver,
    [zkpReq],
    responseScope
  );
  return adaptOidcResp;
};

export const OpenIdRequest = () => {
  const navigate = useNavigate();
  const payload = useQuery("payload");
  const [error, setError] = useState(null);
  const [request, setRequest] = useState(null);
  const [response, setResponse] = useState(null);
  const [isReady, setIsReady] = useState(true);

  !request && setRequest(JSON.parse(decodeBase64url(payload)));
  console.log('request', request);

  useEffect(() => {
	    const { dataStorage } = ExtensionService.getExtensionServiceInstance();
    }, [])


  async function handleClickReject() {
    navigate("/");
  }
  
  async function handleClickProof() {
    setIsReady(false);
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    const authResponse = await generateResponse(request, accounts[0].did);
    console.log('response', authResponse);
    setResponse(authResponse);
    setIsReady(true);
  }
  
  async function handleClickAuthorize() {
    setIsReady(false);
    const authResponse = await fetch('http://localhost:4444/api/verifier/verify', {
      method: 'POST',
      body: JSON.stringify(response)
    });
    if (authResponse.ok) {
      navigate('/');
    } else {
      setError('invalid proof');
    }
    setIsReady(true);
  }
  
  
  const progressHeight = 20;
  return (
    <div className={"auth-wrapper"}>
      <img src={FullLogo} alt={""} />
      <h2 >
       OpenID Authorization Request
      </h2>
      <div className="progress-indicator" style={{ height: progressHeight }}>
        {!isReady && <LinearProgress size={progressHeight} />}
      </div>
        {!response && request && <div>
          <h3>Request:</h3>
          {JSON.stringify(request)}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickProof}
            >
              Generate Proof
            </Button>
            <Button
              className={"blue-button blue-button-outlined"}
              color="primary"
              size="medium"
              variant="outlined"
              onClick={handleClickReject}
            >
              Decline
            </Button>
          </div>
        </div>}
        {response && <div>
          <h3>Response:</h3>
          {JSON.stringify(response)}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickAuthorize}
            >
              Authorize
            </Button>
            <Button
              className={"blue-button blue-button-outlined"}
              color="primary"
              size="medium"
              variant="outlined"
              onClick={handleClickReject}
            >
              Decline
            </Button>
          </div>
        </div>}
      </div>
  )
};