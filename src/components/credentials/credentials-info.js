import React from "react";
import { CredentialsListItem } from "./credentials-list-item";
import { CredentialDetails } from "./credential-details";
import "./styles.css";
const credentials = [
  {
    id: "http://52.213.238.159/api/v1/identities/did:polygonid:polygon:mumbai:2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK/claims/ecd17150-b203-11ed-a51b-0242ac170007",
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/iden3credential-v2.json-ld",
      "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
    ],
    type: ["VerifiableCredential", "KYCAgeCredential"],
    expirationDate: "2030-01-01T00:00:00Z",
    issuanceDate: "2023-02-21T16:22:24.614811146Z",
    credentialSubject: {
      birthday: 19960424,
      documentType: 463941,
      id: "did:polygonid:polygon:mumbai:2qLXQ8tcDaAqXAd7RsGnP8AtgQRGHVJccchBDGHovg",
      type: "PASS",
    },
    credentialStatus: {
      id: "http://52.213.238.159/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK/claims/revocation/status/1492937061",
      revocationNonce: 1492937061,
      type: "SparseMerkleTreeProof",
    },
    issuer:
      "did:polygonid:polygon:mumbai:2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK",
    credentialSchema: {
      id: "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v3.json",
      type: "JsonSchemaValidator2018",
    },
    proof: [
      {
        type: "BJJSignature2021",
        issuerData: {
          id: "did:polygonid:polygon:mumbai:2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK",
          state: {
            claimsTreeRoot:
              "4c398d3dc058c9e59f817b02e13907c55a9a424886dfc587341db50b681a3202",
            value:
              "e80f618a456d75702df31bb5bbe6923be07f62f20a4354892b5e11ddaee40b1b",
          },
          authCoreClaim:
            "cca3371a6cb1b715004407e325bd993c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000050a6f8fd5651d1ee747db5e3f7dbd732b7760243b0d6f8664ec06f8072aa6e0de1768caad8e92c00b4aca6ab4439b2cd75bf12b72ac627232cabdd8cac0621070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          mtp: {
            existence: true,
            siblings: [
              "0",
              "652133141036770705430535325396929970677697129471711783039925044948589013724",
            ],
          },
          credentialStatus: {
            id: "http://52.213.238.159/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK/claims/revocation/status/0",
            revocationNonce: 0,
            type: "SparseMerkleTreeProof",
          },
        },
        coreClaim:
          "c9b2370371b7fa8b3dab2a5ba81b68382a0000000000000000000000000000000212b17ca618d0b7e5fcf4cdf0a1b25b676aada5bcd8dbe4976314a9271a1100aef0d464e5774dc22ec7bfac50935394478bc07e7fe23bd5adc5a70caf98440e00000000000000000000000000000000000000000000000000000000000000006569fc580000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        signature:
          "33e33c68fe8f429c502167765ea217a0985d017a80bdb9eb4b6995968b7645af6a70a45698600250b977d8f3bb695eb5eb0f6202f51795435fa91047b2a33405",
      },
      {
        type: "Iden3SparseMerkleProof",
        issuerData: {
          id: "did:polygonid:polygon:mumbai:2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK",
          state: {
            txId: "0xf7eb272c2d70ae034c415a21611c37ba091f10de37f76ae29feb155df05b8de2",
            blockTimestamp: 1676996641,
            blockNumber: 32264290,
            rootOfRoots:
              "ac959c5d8edc8a85168904a1ae684d6b56959963d3af3ba29088d846d1e5852e",
            claimsTreeRoot:
              "edfaca49bd90f9d8b44a9429c87669b11eaf1f8a581eb9b51f0733658493191f",
            revocationTreeRoot:
              "d7bd1c339cddd6a8bf27a51d0634e0b1ad967f90740543f7e324566259988f14",
            value:
              "efcfdd2989db6abf3a30b938c691a1956ee5ac6a5ad73bcac8df84ee5d10670c",
          },
        },
        coreClaim:
          "c9b2370371b7fa8b3dab2a5ba81b68382a0000000000000000000000000000000212b17ca618d0b7e5fcf4cdf0a1b25b676aada5bcd8dbe4976314a9271a1100aef0d464e5774dc22ec7bfac50935394478bc07e7fe23bd5adc5a70caf98440e00000000000000000000000000000000000000000000000000000000000000006569fc580000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        mtp: {
          existence: true,
          siblings: [
            "3564674516436869529463775551345872376687165073204904134297271818857469005690",
            "2027391455494430199897021620004772788864712733554276609484376809875148431538",
            "18716358822299292268826858890529096501666384960237469618147250837821347350525",
            "17052331363050535349928356270068551163308720831953161803965214942203935512978",
            "9581976847350966197676846552050580642812941824969403827046528878857419393967",
            "9659062114566385775238299515522281931367619291503283651366419611625497788492",
            "17266999506296362994794452669066438213257172528514842223400534869909405671978",
            "0",
            "0",
            "18537823632814493381286672567712123175994225965957755652728795421877444875571",
          ],
        },
      },
    ],
  },
  {
    id: "http://52.213.238.159/api/v1/identities/did:polygonid:polygon:mumbai:2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK/claims/ecd17150-b203-11ed-a51b-0242ac170007",
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/iden3credential-v2.json-ld",
      "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
    ],
    type: ["VerifiableCredential", "KYCAgeCredential"],
    expirationDate: "2030-01-01T00:00:00Z",
    issuanceDate: "2023-02-21T16:22:24.614811146Z",
    credentialSubject: {
      birthday: 19960424,
      documentType: 463941,
      id: "did:polygonid:polygon:mumbai:2qLXQ8tcDaAqXAd7RsGnP8AtgQRGHVJccchBDGHovg",
      type: "KYCAgeCredential",
    },
    credentialStatus: {
      id: "http://52.213.238.159/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK/claims/revocation/status/1492937061",
      revocationNonce: 1492937061,
      type: "SparseMerkleTreeProof",
    },
    issuer:
      "did:polygonid:polygon:mumbai:2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK",
    credentialSchema: {
      id: "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v3.json",
      type: "JsonSchemaValidator2018",
    },
    proof: [
      {
        type: "BJJSignature2021",
        issuerData: {
          id: "did:polygonid:polygon:mumbai:2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK",
          state: {
            claimsTreeRoot:
              "4c398d3dc058c9e59f817b02e13907c55a9a424886dfc587341db50b681a3202",
            value:
              "e80f618a456d75702df31bb5bbe6923be07f62f20a4354892b5e11ddaee40b1b",
          },
          authCoreClaim:
            "cca3371a6cb1b715004407e325bd993c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000050a6f8fd5651d1ee747db5e3f7dbd732b7760243b0d6f8664ec06f8072aa6e0de1768caad8e92c00b4aca6ab4439b2cd75bf12b72ac627232cabdd8cac0621070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          mtp: {
            existence: true,
            siblings: [
              "0",
              "652133141036770705430535325396929970677697129471711783039925044948589013724",
            ],
          },
          credentialStatus: {
            id: "http://52.213.238.159/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK/claims/revocation/status/0",
            revocationNonce: 0,
            type: "SparseMerkleTreeProof",
          },
        },
        coreClaim:
          "c9b2370371b7fa8b3dab2a5ba81b68382a0000000000000000000000000000000212b17ca618d0b7e5fcf4cdf0a1b25b676aada5bcd8dbe4976314a9271a1100aef0d464e5774dc22ec7bfac50935394478bc07e7fe23bd5adc5a70caf98440e00000000000000000000000000000000000000000000000000000000000000006569fc580000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        signature:
          "33e33c68fe8f429c502167765ea217a0985d017a80bdb9eb4b6995968b7645af6a70a45698600250b977d8f3bb695eb5eb0f6202f51795435fa91047b2a33405",
      },
      {
        type: "Iden3SparseMerkleProof",
        issuerData: {
          id: "did:polygonid:polygon:mumbai:2qHSHBGWGJ68AosMKcLCTp8FYdVrtYE6MtNHhq8xpK",
          state: {
            txId: "0xf7eb272c2d70ae034c415a21611c37ba091f10de37f76ae29feb155df05b8de2",
            blockTimestamp: 1676996641,
            blockNumber: 32264290,
            rootOfRoots:
              "ac959c5d8edc8a85168904a1ae684d6b56959963d3af3ba29088d846d1e5852e",
            claimsTreeRoot:
              "edfaca49bd90f9d8b44a9429c87669b11eaf1f8a581eb9b51f0733658493191f",
            revocationTreeRoot:
              "d7bd1c339cddd6a8bf27a51d0634e0b1ad967f90740543f7e324566259988f14",
            value:
              "efcfdd2989db6abf3a30b938c691a1956ee5ac6a5ad73bcac8df84ee5d10670c",
          },
        },
        coreClaim:
          "c9b2370371b7fa8b3dab2a5ba81b68382a0000000000000000000000000000000212b17ca618d0b7e5fcf4cdf0a1b25b676aada5bcd8dbe4976314a9271a1100aef0d464e5774dc22ec7bfac50935394478bc07e7fe23bd5adc5a70caf98440e00000000000000000000000000000000000000000000000000000000000000006569fc580000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        mtp: {
          existence: true,
          siblings: [
            "3564674516436869529463775551345872376687165073204904134297271818857469005690",
            "2027391455494430199897021620004772788864712733554276609484376809875148431538",
            "18716358822299292268826858890529096501666384960237469618147250837821347350525",
            "17052331363050535349928356270068551163308720831953161803965214942203935512978",
            "9581976847350966197676846552050580642812941824969403827046528878857419393967",
            "9659062114566385775238299515522281931367619291503283651366419611625497788492",
            "17266999506296362994794452669066438213257172528514842223400534869909405671978",
            "0",
            "0",
            "18537823632814493381286672567712123175994225965957755652728795421877444875571",
          ],
        },
      },
    ],
  },
];
export const CredentialsInfo = (props) => {
  const [selectedCredential, setSelectedCredential] = React.useState(null);

  if (selectedCredential) {
    return (
      <CredentialDetails
        credential={selectedCredential}
        onBack={() => setSelectedCredential(null)}
      />
    );
  }

  const handleCredentialClick = (credential) => {
    setSelectedCredential(credential);
  };
  return (
    <div className={"credentials-info-wrapper"}>
      {credentials.map((credential, index) => {
        return (
          <CredentialsListItem
            key={index}
            name={credential.credentialSubject.type}
            issuer={credential.issuer}
            credential={credential}
            onClick={handleCredentialClick}
          />
        );
      })}
    </div>
  );
};
