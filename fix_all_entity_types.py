import json
import os
import csv
from io import StringIO

# Ścieżka do pliku JSON
json_file_path = 'packages/demo/public/ai_news_dataset.json'

# Sprawdzamy, czy plik JSON istnieje
if not os.path.exists(json_file_path):
    print(f"Plik {json_file_path} nie istnieje!")
    exit(1)

# Wczytujemy dane z pliku JSON
with open(json_file_path) as f:
    data = json.load(f)

print(f"Wczytano {len(data['nodes'])} węzłów z pliku JSON")

# Tworzymy przykładowy plik CSV na podstawie danych z zapytania
csv_data = """type,entity_name,entity_type,entity_category,entity_definition,entity_strength,entity_occurrence
ent,AI Age,Concept,"AI, History, Future","Era defined by the dominant influence of artificial intelligence",75,1
ent,Artificial Intelligence,Concept,"AI, Technology, Innovation","Technology being promoted as a transformative force",100,7
ent,AEC,Field,"Architecture, Engineering, Construction","Sectors including architecture, engineering, and construction",80,2
ent,Urban Planning,Field,"Urban Development, Smart Cities","Planning and development of urban areas",70,2
ent,Facility Management,Field,"Building Operations, Infrastructure","Management of buildings and facilities",70,2
ent,Digital Twins,Technology,"3D Modeling, Data Capture, Simulation","Virtual representations of physical assets or systems",95,14
ent,3D Modeling,Technology,"Visualization, Design, Geospatial","Creating three-dimensional representations of objects or environments",85,2
ent,Data Capture,Method,"Data Collection, Geospatial, Reality Capture","Process of collecting data from the real world",80,2
ent,5G,Technology,"Connectivity, Telecommunications","Fifth generation of wireless technology",75,1
ent,IoT Sensors,Technology,"Internet of Things, Data Collection","Sensors connected to the internet for data collection",85,1
ent,Generative AI,Model,"AI, Content Creation, Machine Learning","Type of AI that generates new content",90,1
ent,Large Language Models,Model,"AI, Natural Language Processing, Machine Learning","AI models that process and generate human language",92,3
ent,Computer Vision,Field,"AI, Image Recognition, Machine Learning","Field of AI that enables computers to see and interpret images",85,1
ent,Machine Learning,Field,"AI, Data Analysis, Pattern Recognition","Type of AI that learns from data without explicit programming",90,1
ent,Data Centers,Location,"Infrastructure, Computing","Facilities housing computer systems and associated components",80,2
ent,Energy Industry,Field,"Energy, Utilities, Sustainability","Industry focused on the production and distribution of energy",75,1
ent,Singapore,Location,"Urban Planning, Smart Cities","City-state known for advanced urban planning and technology",70,1
ent,Mediterranean,Location,"Geography, Regional Planning","Region where digital twin simulations are being used for energy planning",65,1
ent,Matt Collins,Person,"Content Creation, Journalism","Content Specialist at Geo Week",60,2
ent,Geo Week,Event,"Geospatial, Technology, Conference","Conference focused on geospatial technologies",70,7
ent,Diversified Communications,Organization,"Media, Events","Company owning Geo Week and other events",65,2"""

# Parsujemy dane CSV
csv_reader = csv.DictReader(StringIO(csv_data))
entity_types_map = {}
for row in csv_reader:
    entity_name = row['entity_name']
    entity_type = row['entity_type']
    entity_types_map[entity_name] = entity_type

# Słownik domyślnych typów dla encji, które nie są w CSV
default_entity_types = {
    "AI": "Concept",
    "GPT": "Model",
    "ChatGPT": "Model",
    "OpenAI": "Organization",
    "Google": "Organization",
    "Microsoft": "Organization",
    "Meta": "Organization",
    "Amazon": "Organization",
    "Apple": "Organization",
    "IBM": "Organization",
    "NVIDIA": "Organization",
    "Tesla": "Organization",
    "DeepMind": "Organization",
    "Anthropic": "Organization",
    "Claude": "Model",
    "Gemini": "Model",
    "Bard": "Model",
    "Bing": "Service",
    "GitHub": "Platform",
    "Copilot": "Tool",
    "Midjourney": "Tool",
    "DALL-E": "Model",
    "Stable Diffusion": "Model",
    "Python": "Language",
    "JavaScript": "Language",
    "TypeScript": "Language",
    "React": "Framework",
    "Angular": "Framework",
    "Vue": "Framework",
    "Node.js": "Platform",
    "TensorFlow": "Framework",
    "PyTorch": "Framework",
    "Keras": "Framework",
    "Hugging Face": "Platform",
    "Transformers": "Model",
    "BERT": "Model",
    "GPT-3": "Model",
    "GPT-4": "Model",
    "LLaMA": "Model",
    "Mistral": "Model",
    "Falcon": "Model",
    "Sam Altman": "Person",
    "Elon Musk": "Person",
    "Sundar Pichai": "Person",
    "Satya Nadella": "Person",
    "Mark Zuckerberg": "Person",
    "Jeff Bezos": "Person",
    "Tim Cook": "Person",
    "Demis Hassabis": "Person",
    "Dario Amodei": "Person",
    "Yann LeCun": "Person",
    "Geoffrey Hinton": "Person",
    "Andrew Ng": "Person",
    "Andrej Karpathy": "Person",
    "Ian Goodfellow": "Person",
    "Yoshua Bengio": "Person",
    "Fei-Fei Li": "Person",
    "Ilya Sutskever": "Person",
    "Reinforcement Learning": "Technique",
    "Supervised Learning": "Technique",
    "Unsupervised Learning": "Technique",
    "Deep Learning": "Technique",
    "Neural Network": "Technology",
    "Convolutional Neural Network": "Technology",
    "Recurrent Neural Network": "Technology",
    "Transformer": "Architecture",
    "Attention Mechanism": "Technique",
    "Transfer Learning": "Technique",
    "Fine-tuning": "Technique",
    "Prompt Engineering": "Technique",
    "Natural Language Processing": "Field",
    "Computer Vision": "Field",
    "Robotics": "Field",
    "Autonomous Vehicles": "Technology",
    "Drones": "Technology",
    "Internet of Things": "Technology",
    "Blockchain": "Technology",
    "Cryptocurrency": "Technology",
    "Bitcoin": "Technology",
    "Ethereum": "Technology",
    "Virtual Reality": "Technology",
    "Augmented Reality": "Technology",
    "Mixed Reality": "Technology",
    "Metaverse": "Concept",
    "Web3": "Concept",
    "Cloud Computing": "Technology",
    "Edge Computing": "Technology",
    "Quantum Computing": "Technology",
    "Cybersecurity": "Field",
    "Data Science": "Field",
    "Big Data": "Concept",
    "Data Mining": "Technique",
    "Data Visualization": "Technique",
    "Business Intelligence": "Field",
    "Machine Learning Operations": "Field",
    "DevOps": "Practice",
    "Agile": "Methodology",
    "Scrum": "Methodology",
    "Kanban": "Methodology",
    "Waterfall": "Methodology",
    "Software Development": "Field",
    "Web Development": "Field",
    "Mobile Development": "Field",
    "Game Development": "Field",
    "User Experience": "Field",
    "User Interface": "Field",
    "Accessibility": "Concept",
    "Responsive Design": "Concept",
    "Progressive Web App": "Concept",
    "Single Page Application": "Concept",
    "Microservices": "Architecture",
    "Monolith": "Architecture",
    "Serverless": "Architecture",
    "Container": "Technology",
    "Docker": "Technology",
    "Kubernetes": "Technology",
    "Git": "Tool",
    "GitHub": "Platform",
    "GitLab": "Platform",
    "Bitbucket": "Platform",
    "Jira": "Tool",
    "Confluence": "Tool",
    "Slack": "Tool",
    "Microsoft Teams": "Tool",
    "Zoom": "Tool",
    "Google Meet": "Tool",
    "Google Docs": "Tool",
    "Microsoft Office": "Tool",
    "Visual Studio Code": "Tool",
    "IntelliJ IDEA": "Tool",
    "PyCharm": "Tool",
    "Jupyter Notebook": "Tool",
    "Google Colab": "Tool",
    "AWS": "Platform",
    "Azure": "Platform",
    "Google Cloud": "Platform",
    "IBM Cloud": "Platform",
    "Oracle Cloud": "Platform",
    "DigitalOcean": "Platform",
    "Heroku": "Platform",
    "Netlify": "Platform",
    "Vercel": "Platform",
    "Firebase": "Platform",
    "MongoDB": "Database",
    "PostgreSQL": "Database",
    "MySQL": "Database",
    "SQLite": "Database",
    "Redis": "Database",
    "Elasticsearch": "Database",
    "Cassandra": "Database",
    "Neo4j": "Database",
    "GraphQL": "Query Language",
    "REST": "Architecture",
    "SOAP": "Protocol",
    "gRPC": "Protocol",
    "WebSocket": "Protocol",
    "HTTP": "Protocol",
    "HTTPS": "Protocol",
    "TCP/IP": "Protocol",
    "UDP": "Protocol",
    "IPv4": "Protocol",
    "IPv6": "Protocol",
    "DNS": "Protocol",
    "DHCP": "Protocol",
    "FTP": "Protocol",
    "SMTP": "Protocol",
    "POP3": "Protocol",
    "IMAP": "Protocol",
    "SSH": "Protocol",
    "SSL/TLS": "Protocol",
    "OAuth": "Protocol",
    "OpenID": "Protocol",
    "SAML": "Protocol",
    "JWT": "Standard",
    "JSON": "Format",
    "XML": "Format",
    "YAML": "Format",
    "Markdown": "Format",
    "HTML": "Language",
    "CSS": "Language",
    "SASS": "Language",
    "LESS": "Language",
    "SQL": "Language",
    "NoSQL": "Concept",
    "ACID": "Concept",
    "BASE": "Concept",
    "CAP Theorem": "Concept",
    "Sharding": "Technique",
    "Replication": "Technique",
    "Load Balancing": "Technique",
    "Caching": "Technique",
    "CDN": "Technology",
    "SEO": "Technique",
    "SEM": "Technique",
    "Digital Marketing": "Field",
    "Content Marketing": "Field",
    "Social Media Marketing": "Field",
    "Email Marketing": "Field",
    "Affiliate Marketing": "Field",
    "Influencer Marketing": "Field",
    "Growth Hacking": "Field",
    "Product Management": "Field",
    "Project Management": "Field",
    "Program Management": "Field",
    "Portfolio Management": "Field",
    "Risk Management": "Field",
    "Change Management": "Field",
    "Quality Assurance": "Field",
    "Quality Control": "Field",
    "Testing": "Field",
    "Unit Testing": "Technique",
    "Integration Testing": "Technique",
    "System Testing": "Technique",
    "Acceptance Testing": "Technique",
    "Regression Testing": "Technique",
    "Performance Testing": "Technique",
    "Load Testing": "Technique",
    "Stress Testing": "Technique",
    "Security Testing": "Technique",
    "Penetration Testing": "Technique",
    "Vulnerability Assessment": "Technique",
    "Code Review": "Technique",
    "Pair Programming": "Technique",
    "Mob Programming": "Technique",
    "Test-Driven Development": "Methodology",
    "Behavior-Driven Development": "Methodology",
    "Domain-Driven Design": "Methodology",
    "Continuous Integration": "Practice",
    "Continuous Delivery": "Practice",
    "Continuous Deployment": "Practice",
    "Infrastructure as Code": "Practice",
    "Configuration as Code": "Practice",
    "GitOps": "Practice",
    "ChatOps": "Practice",
    "NoOps": "Practice",
    "AIOps": "Practice",
    "MLOps": "Practice",
    "DataOps": "Practice",
    "FinOps": "Practice",
    "SecOps": "Practice",
    "DevSecOps": "Practice",
    "SRE": "Practice",
    "Observability": "Concept",
    "Monitoring": "Concept",
    "Logging": "Concept",
    "Tracing": "Concept",
    "Alerting": "Concept",
    "Dashboarding": "Concept",
    "Metrics": "Concept",
    "KPIs": "Concept",
    "OKRs": "Concept",
    "SMART Goals": "Concept",
    "Agile Manifesto": "Concept",
    "Lean": "Methodology",
    "Six Sigma": "Methodology",
    "ITIL": "Framework",
    "COBIT": "Framework",
    "TOGAF": "Framework",
    "PMBOK": "Framework",
    "PRINCE2": "Framework",
    "ISO 9001": "Standard",
    "ISO 27001": "Standard",
    "GDPR": "Regulation",
    "CCPA": "Regulation",
    "HIPAA": "Regulation",
    "PCI DSS": "Standard",
    "SOC 2": "Standard",
    "NIST": "Framework",
    "CIS": "Framework",
    "OWASP": "Organization",
    "IEEE": "Organization",
    "W3C": "Organization",
    "IETF": "Organization",
    "ISO": "Organization",
    "ANSI": "Organization",
    "ECMA": "Organization",
    "ACM": "Organization",
    "IEEE": "Organization"
}

# Naprawiamy entity_type w węzłach
fixed_nodes = 0
for node in data['nodes']:
    # Sprawdzamy, czy węzeł ma pole entity_type
    if 'entity_type' in node:
        label = node['label']
        
        # Sprawdzamy, czy mamy mapowanie dla tej encji w CSV
        if label in entity_types_map:
            correct_entity_type = entity_types_map[label]
            if node['entity_type'] != correct_entity_type:
                node['entity_type'] = correct_entity_type
                fixed_nodes += 1
                print(f"Naprawiono entity_type dla '{label}': {node['entity_type']} -> {correct_entity_type}")
        # Jeśli nie ma w CSV, sprawdzamy domyślne mapowanie
        elif label in default_entity_types:
            correct_entity_type = default_entity_types[label]
            if node['entity_type'] != correct_entity_type:
                node['entity_type'] = correct_entity_type
                fixed_nodes += 1
                print(f"Naprawiono entity_type dla '{label}' (domyślny): {node['entity_type']} -> {correct_entity_type}")
        # Jeśli nie ma w żadnym mapowaniu, używamy "Unknown"
        else:
            # Zachowujemy obecny typ, jeśli wygląda sensownie
            current_type = node['entity_type']
            if current_type in ["Technology", "Field", "Concept", "Model", "Method", "Location", "Person", "Event", "Organization"]:
                print(f"Zachowano entity_type dla '{label}': {current_type}")
            else:
                node['entity_type'] = "Unknown"
                fixed_nodes += 1
                print(f"Naprawiono entity_type dla '{label}' (nieznany): {current_type} -> Unknown")

print(f"\nNaprawiono {fixed_nodes} węzłów")

# Zapisujemy poprawione dane do pliku JSON
with open(json_file_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Zapisano poprawione dane do pliku {json_file_path}")
print("Teraz uruchom ponownie aplikację, aby zobaczyć poprawione typy encji w panelu typów") 