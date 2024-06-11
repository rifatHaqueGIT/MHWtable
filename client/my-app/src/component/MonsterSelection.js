import {
    Select, option, Button, HStack, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import axios from 'axios';

function MonsterSelection({ children, ...dataProp }) {


    const [monsters, setMonsters] = useState([]);
    const [selectedMonster, setSelectedMonster] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [monsterStats, setMonsterStats] = useState([]);
    const [monsterHeader, setMonsterHeader] = useState([]);


    const handleOptionChange = (event) => {
        //console.log(event.target.value);
        setSelectedMonster(event.target.value);
    };

    const handleButtonClick = async () => {
        console.log(selectedMonster);
        if (selectedMonster !== '') {
            // Find the selected monster from the list
            const selected = Object.values(monsters).find(mon => mon == selectedMonster);

            //console.log(selected);
            if (selected) {
                try {
                    const response = await axios.get(`http://localhost:3001/api/data?name=${selectedMonster}`);
                    console.log(response);

                    setMonsterStats([response.data]);

                    const tempArray = [];
                    Object.keys(response.data[0]).forEach(key => {
                        if (key !== "_id" && key !== "level_0") {
                            tempArray.push(key);
                        }
                    })
                    if (tempArray.length != 0)
                        setMonsterHeader(tempArray);



                } catch (err) {
                    console.error("Error while getting monster table", err)
                }
                //console.log(monsterStats);
                setShowTable(true);
            } else {
                alert('Selected monster not found!');
            }
        } else {
            alert('Please select a monster');
        }
    };
    useEffect(() => {
        const fetchUniqueNames = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/monsterlist');
                setMonsters(response.data.sort());
            } catch (err) {
                console.error('Error fetching unique names:', err);
            }
        };

        fetchUniqueNames();
    }, []);
    useEffect(() => {
        console.log(monsterStats)
    }, [monsterStats]);
    // useEffect(() => {
    //     //"_id": { "$oid": "6622c202004492a2fee6632f" }
    //     setMonsters([{ "Name": "acidic-glavenus", "Part": "Head", "Sever": "43", "Blunt": "55", "Ranged": "45", "Fire": "20", "Water": "10", "Paralysis": "15", "Frost": "5", "Dragon": "15", "Stun": "100", "Stamina": "100" }])
    // }, []);
    return (
        <VStack>
            <HStack align='center' gap='2' >
                <Select placeholder='Select option' id='1' onChange={handleOptionChange}>
                    {
                        monsters.map((mon) => (<option value={mon} key={mon}>{mon}</option>))
                    }


                </Select>

                <Button
                    onClick={handleButtonClick}
                    size='md'
                    height='47px'
                    width='150px'
                    border='1px'>
                    Submit
                </Button>

            </HStack>
            {showTable && (<>
                <Table variant="simple" textColor={'black'}>
                    <TableCaption textColor={'black'}>
                        {selectedMonster}
                    </TableCaption>
                    <Thead>
                        <Tr>
                            {monsterHeader.map(n => {
                                return (<Th key={n} textColor={'black'}>{n}</Th>);
                            })}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {monsterStats[0].map((part, index) => {
                            return (<Tr key={index}>
                                <Td>{part.Part}</Td>
                                <Td>{part.Sever}</Td>
                                <Td>{part.Blunt}</Td>
                                <Td>{part.Ranged}</Td>
                                <Td>{part.Fire}</Td>
                                <Td>{part.Water}</Td>
                                <Td>{part.Paralysis}</Td>
                                <Td>{part.Frost}</Td>
                                <Td>{part.Dragon}</Td>
                                <Td>{part.Stun}</Td>
                                <Td>{part.Stamina}</Td>
                            </Tr>);
                        })}
                    </Tbody>
                </Table>
            </>)}
        </VStack>
    );
};

export default MonsterSelection;
