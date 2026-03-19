const usrs = [
    { username: 'Detective', password: 'Test123!', friends: ['Jack', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', ], outgoing: ['Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', ], incoming: ['Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', ] },
    { username: 'Jack', password: 'Test123!', friends: ['Detective', 'Tester'], outgoing: [], incoming: [] },
    { username: 'Tester', password: 'Test123!', friends: ['Jack'], outgoing: [], incoming: [] },
    { username: 'Test', password: 'Test123!', friends: ['Detective'], outgoing: ['Detective'], incoming: ['Detective'] },
]

export default usrs