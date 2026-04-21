const shipHead = `
    <div class="ship__fragment">
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 12 4 -1.90735e-06 16 -1.90735e-06C28 -1.90735e-06 32 -1.90735e-06 32 -1.90735e-06V24C32 24 28 24 16 24C4 24 0 12 0 12Z" fill="black"/>
        </svg>
    </div>
`;

const shipFragment = `
    <div class="ship__fragment">
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 -1.90735e-06L40 -1.90735e-06V24L0 24L0 -1.90735e-06Z" fill="black"/>
        </svg>
    </div>
`;

const shipTail = `
    <div class="ship__fragment">
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 12C32 12 28 24 16 24C4 24 0 24 0 24L0 6.01324e-07C0 6.01324e-07 4 6.01324e-07 16 6.01324e-07C28 6.01324e-07 32 12 32 12Z" fill="black"/>
          </svg>
    </div>
`;

const Carrier = `
    <li>
      <span class="ship__name">Carrier</span>
      <div class="ship">
        ${shipHead}
        ${shipFragment}
        ${shipFragment}
        ${shipFragment}
        ${shipTail}
      </div>
    </li>
`;

const Battleship = `
    <li>
      <span class="ship__name">BattleShip</span>
      <div class="ship">
        ${shipHead}
        ${shipFragment}
        ${shipFragment}
        ${shipTail}
      </div>
    </li>
`;

const Destroyer = `
    <li>
      <span class="ship__name">Destroyer</span>
      <div class="ship">
        ${shipHead}
        ${shipFragment}
        ${shipTail}
      </div>
    </li>
`;

const Submarine = `
    <li>
      <span class="ship__name">Submarine</span>
      <div class="ship">
        ${shipHead}
        ${shipFragment}
        ${shipTail}
      </div>
    </li>
`;

const Patrol = `
    <li>
      <span class="ship__name">Patrol</span>
      <div class="ship">
        ${shipHead}
        ${shipTail}
      </div>
    </li>
`;

const Content = `
These are the ships you should place on your board. Remember, that ships can't be touching each other on either of the sides, including corner edges. 
`;
export { Carrier, Battleship, Destroyer, Submarine, Patrol, Content };
